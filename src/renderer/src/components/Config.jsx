import { useState, useEffect } from 'react'

function Config() {
  const [pastaMods, setPastaMods] = useState('')
  const [arquivoJson, setArquivoJson] = useState('')

  //Vai carregar os caminhos de maneira autonoma.
  useEffect(() => {
    window.api.carregarConfig().then((config) => {
      setPastaMods(config.mods)
      setArquivoJson(config.json)
    })
  }, [])

  const escolherPastaMods = async () => {
    const caminho = await window.api.selecionarPasta()
    if (caminho) setPastaMods(caminho)
  }

  const escolherArquivoJson = async () => {
    const caminho = await window.api.selecionarArquivo()
    if (caminho) setArquivoJson(caminho)
  }

  const salvar = async () => {
    await window.api.salvarCaminhos({ mods: pastaMods, json: arquivoJson })
    props.onSalvar()
  }

  return (
    <div>
      <h2>Configuração</h2>

      <div>
        <p>Pasta de mods: {pastaMods || 'nenhuma selecionada'}</p>
        <button onClick={escolherPastaMods}>Selecionar pasta</button>
      </div>

      <div>
        <p>Arquivo dlc_load.json: {arquivoJson || 'nenhum selecionado'}</p>
        <button onClick={escolherArquivoJson}>Selecionar arquivo</button>
      </div>

      <button onClick={salvar}>Salvar</button>
    </div>
  )
}

export default Config
