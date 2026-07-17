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

  if (tela === 'carregando') return <p>Carregando...</p>
  if (tela === 'config') return <Config onSalvar={() => setTela('mods')} />

  return (
    <div className="h-screen flex bg-neutral-950">
      {/* MENU LATERAL FIXO */}
      <aside className="w-20 bg-neutral-900 border-r border-neutral-800 flex flex-col items-center py-6 gap-4 shrink-0">
        {/* Logo ou ícone do app */}
        <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center text-neutral-950 font-bold text-xl mb-4">
          HL
        </div>

        {/* Botão Salvar */}
        <button
          onClick={salvarMods}
          className="w-12 h-12 rounded-lg bg-amber-600 text-neutral-950 font-semibold hover:bg-amber-500 transition-colors cursor-pointer active:bg-amber-700 active:scale-95 flex flex-col items-center justify-center text-xs gap-1 group relative"
          title="Salvar mods"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          <span>Salvar</span>
        </button>

        {/* Botão Configurações */}
        <button
          onClick={() => setTela('config')}
          className="w-12 h-12 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors cursor-pointer active:scale-95 flex flex-col items-center justify-center text-xs gap-1 group relative"
          title="Configurações"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>Config</span>
        </button>
        {/* Botão abrir pasta Mods */}
        <button
          onClick={() => window.api.abrirPastaMods()}
          className="w-12 h-12 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors cursor-pointer active:scale-95 flex flex-col items-center justify-center text-xs gap-1 group relative"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-19.5 0v6a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25v-6m-19.5 0h19.5M6 6h4.5l2.25 2.25H18a2.25 2.25 0 012.25 2.25v.75"
            />
          </svg>
          <span>Pasta</span>
        </button>

        {/* Botão Fechar */}
        <button
          onClick={() => window.api.fecharApp()}
          className="w-12 h-12 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-colors cursor-pointer active:scale-95 flex flex-col items-center justify-center text-xs gap-1 mt-auto group relative"
          title="Fechar aplicativo"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span>Fechar</span>
        </button>
      </aside>

      {/*CONTEÚDO PRINCIPAL*/}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header com título */}
        <header className="shrink-0 p-6 pb-2">
          <h1 className="text-2xl font-bold text-amber-500">Heart Loader 2</h1>
          <p className="text-neutral-500 text-sm mt-1">
            {mods.length} mod{mods.length !== 1 ? 's' : ''} carregado{mods.length !== 1 ? 's' : ''}
          </p>
          <p className="text-neutral-500 text-sm mt-1">
            {mods.filter((mod) => mod.ativo).length} ativo
            {mods.filter((mod) => mod.ativo).length !== 1 ? 's' : ''}
          </p>
        </header>

        {/* Área dos cards */}
        <main className="flex-1 overflow-y-auto px-6 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 auto-rows-fr">
            {mods.map((mod) => (
              <div key={mod.chave} className="aspect-3/4">
                <ModItem
                  nome={mod.nome}
                  ativo={mod.ativo}
                  imagem={mod.imagem}
                  onToggle={() => toggleMod(mod.chave)}
                  onExcluir={() => excluirMod(mod)}
                />
              </div>
            ))}
          </div>
        </main>

        {/* Rodapé */}
        <footer className="shrink-0 py-3 px-6 border-t border-neutral-800">
          <p className="text-2xl text-green-600 text-center">
            {salvo ? 'Mods salvos com sucesso!' : ''}
          </p>
          <p className="text-center text-neutral-700 hover:text-amber-600 cursor-pointer text-sm transition-colors">
            Versão: Beta.1.0.1
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
