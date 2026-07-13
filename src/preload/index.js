import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  selecionarPasta: () => ipcRenderer.invoke('selecionar-pasta'),
  selecionarArquivo: () => ipcRenderer.invoke('selecionar-arquivo'),
  salvarCaminhos: (caminhos) => ipcRenderer.invoke('salvar-caminhos', caminhos),
  carregarConfig: () => ipcRenderer.invoke('carregar-config'),
  carregarMods: () => ipcRenderer.invoke('carregar-mods'),
  salvarMods: (mods) => ipcRenderer.invoke('salvar-mods', mods),
  excluirMod: (mod) => ipcRenderer.invoke('excluir-mod', mod),
  fecharApp: () => ipcRenderer.invoke('fechar-app')
}
contextBridge.exposeInMainWorld('api', api)

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
