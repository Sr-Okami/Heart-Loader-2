import { useState, useEffect } from 'react'

function Config({ onSalvar }) {
  const [pastaMods, setPastaMods] = useState('')
  const [arquivoJson, setArquivoJson] = useState('')

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
    onSalvar()
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
      <div className="flex flex-col gap-4 w-full max-w-md p-6 rounded-lg border border-neutral-800 bg-neutral-900">
        <h2 className="text-2xl font-bold text-amber-500">Configuração</h2>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-400">Pasta de mods:</label>
          <input
            type="text"
            value={pastaMods}
            onChange={(e) => setPastaMods(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm focus:outline-none focus:border-amber-600"
          />
          <button
            onClick={escolherPastaMods}
            className="px-4 py-2 rounded-lg bg-amber-600 text-neutral-950 font-semibold hover:bg-amber-500 transition-colors cursor-pointer"
          >
            Selecionar pasta
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-400">Arquivo dlc_load.json:</label>
          <input
            type="text"
            value={arquivoJson}
            onChange={(e) => setArquivoJson(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm focus:outline-none focus:border-amber-600"
          />
          <button
            onClick={escolherArquivoJson}
            className="px-4 py-2 rounded-lg bg-amber-600 text-neutral-950 font-semibold hover:bg-amber-500 transition-colors cursor-pointer"
          >
            Selecionar arquivo
          </button>
        </div>

        <button
          onClick={salvar}
          className="px-4 py-2 rounded-lg bg-amber-600 text-neutral-950 font-semibold hover:bg-amber-500 transition-colors mt-2 cursor-pointer"
        >
          Salvar
        </button>
      </div>
    </div>
  )
}

export default Config
