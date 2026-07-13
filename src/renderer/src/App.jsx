import { useState, useEffect } from 'react'
import Config from './components/Config'
import ModItem from './components/ModItem'

function App() {
  const [tela, setTela] = useState('carregando')
  const [mods, setMods] = useState([])
  const [salvo, setSalvo] = useState(false)

  useEffect(() => {
    window.api.carregarConfig().then((config) => {
      if (config.mods && config.json) {
        setTela('mods')
      } else {
        setTela('config')
      }
    })
  }, [])

  useEffect(() => {
    if (tela === 'mods') {
      window.api.carregarMods().then((resultado) => {
        setMods(resultado.mods)
      })
    }
  }, [tela])

  const toggleMod = (chaveDoMod) => {
    setMods(mods.map((mod) => (mod.chave === chaveDoMod ? { ...mod, ativo: !mod.ativo } : mod)))
  }

  if (tela === 'carregando') return <p>Carregando...</p>
  if (tela === 'config') return <Config onSalvar={() => setTela('mods')} />
  const salvarMods = () => {
    const chavesAtivas = mods.filter((mod) => mod.ativo).map((mod) => mod.chave)
    window.api.salvarMods(chavesAtivas)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 3000)
  }
  const excluirMod = async (mod) => {
    const confirmou = confirm(`Excluir o mod "${mod.nome}"? Essa ação não pode ser desfeita.`)
    if (!confirmou) return

    await window.api.excluirMod(mod)
    setMods(mods.filter((m) => m.chave !== mod.chave))
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6">
      <header>
        <h1 className="text-2xl font-bold text-amber-500 mb-4">Heart Loader 2</h1>

        <div className="flex justify-center gap-x-10 mb-4">
          <button
            onClick={salvarMods}
            className="mb-4 px-4 py-2 rounded-lg bg-amber-600 text-neutral-950 font-semibold hover:bg-amber-500 transition-colors cursor-pointer active:bg-amber-700 active:scale-95"
          >
            Salvar
          </button>
          <button
            onClick={() => setTela('config')}
            className="mb-4 px-4 py-2 rounded-lg bg-amber-600 text-neutral-950 font-semibold hover:bg-amber-500 transition-colors cursor-pointer active:bg-amber-700 active:scale-95"
          >
            Configurações
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 pb-10">
        {mods.map((mod) => (
          <ModItem
            key={mod.chave}
            nome={mod.nome}
            ativo={mod.ativo}
            imagem={mod.imagem}
            onToggle={() => toggleMod(mod.chave)}
            onExcluir={() => excluirMod(mod)}
          />
        ))}
      </div>
      <footer>
        <p className="text-sm text-green-600 text-center">
          {salvo ? 'Mods salvos com sucesso!' : ''}
        </p>
      </footer>
    </div>
  )
}

export default App
