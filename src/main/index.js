import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join, extname } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { readFileSync, writeFileSync, existsSync, readdirSync, copyFileSync } from 'fs'
import icon from '../../resources/icon.png?asset'

const arquivoConfig = join(app.getPath('userData'), 'config.json')

function carregarConfig() {
  if (existsSync(arquivoConfig)) {
    return JSON.parse(readFileSync(arquivoConfig, 'utf-8'))
  }
  return { mods: '', json: '' }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => mainWindow.show())

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.heartloader')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  ipcMain.handle('fechar-app', () => {
    app.quit()
  })

  ipcMain.handle('selecionar-pasta', async () => {
    const resultado = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    return resultado.canceled ? null : resultado.filePaths[0]
  })

  ipcMain.handle('selecionar-arquivo', async () => {
    const resultado = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'JSON', extensions: ['json'] }]
    })
    return resultado.canceled ? null : resultado.filePaths[0]
  })

  ipcMain.handle('salvar-caminhos', (event, caminhos) => {
    writeFileSync(arquivoConfig, JSON.stringify(caminhos, null, 2))
  })
  ipcMain.handle('abrir-pasta-mods', () => {
    const config = carregarConfig()
    if (config.mods) shell.openPath(config.mods)
  })

  ipcMain.handle('carregar-config', () => carregarConfig())

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  ipcMain.handle('carregar-mods', async () => {
    const config = carregarConfig()
    if (!config.mods || !config.json) return { erro: 'Caminhos não configurados' }

    const dlc = JSON.parse(readFileSync(config.json, 'utf-8'))
    const ativos = dlc.enabled_mods || []

    const arquivos = readdirSync(config.mods).filter((f) => f.endsWith('.mod'))

    const mods = arquivos.map((arquivo) => {
      const conteudo = readFileSync(join(config.mods, arquivo), 'utf-8')
      const conteudoLimpo = conteudo.replace(/^\uFeFF/, '')
      const nomeMatch = conteudoLimpo.match(/^name="(.+)"/m)
      const VersaoMatch = conteudoLimpo.match(/^version="(.+)"/m)
      const chave = `mod/${arquivo}`

      const nomePasta = arquivo.replace('.mod', '')
      const pastaMod = join(config.mods, nomePasta)
      let imagem = null

      if (existsSync(pastaMod)) {
        const extensoes = ['.jpg', 'jpeg', '.png', '.webp']
        const arquivosPasta = readdirSync(pastaMod)
        const imgEncontrada = arquivosPasta.find((f) =>
          extensoes.includes(extname(f).toLowerCase())
        )
        if (imgEncontrada) {
          const caminhoImagem = join(pastaMod, imgEncontrada)
          const bytes = readFileSync(caminhoImagem)
          const extensao = extname(imgEncontrada).slice(1)
          imagem = `data:image/${extensao};base64,${bytes.toString('base64')}`
        }
      }

      return {
        arquivo,
        chave,
        nome: nomeMatch ? nomeMatch[1] : nomePasta,
        versao: VersaoMatch ? VersaoMatch[1] : '?',
        ativo: ativos.includes(chave),
        imagem
      }
    })
    return { mods, ativos }
  })
})

ipcMain.handle('salvar-mods', async (event, modsSelecionados) => {
  const config = carregarConfig()
  const dlc = JSON.parse(readFileSync(config.json, 'utf-8'))

  const backup = config.json + '.backup'
  copyFileSync(config.json, backup)

  dlc.enabled_mods = modsSelecionados
  writeFileSync(config.json, JSON.stringify(dlc, null, 2))
})

ipcMain.handle('excluir-mod', async (event, mod) => {
  const config = carregarConfig()
  const { rmSync } = await import('fs')
  const nomePasta = mod.arquivo.replace('.mod', '')

  const arquivoMod = join(config.mods, mod.arquivo)
  if (existsSync(arquivoMod)) rmSync(arquivoMod)

  const pastaMod = join(config.mods, nomePasta)
  if (existsSync(pastaMod)) rmSync(pastaMod, { recursive: true, force: true })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
