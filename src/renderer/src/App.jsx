import { useState, useEffect } from 'react'
import Config from './components/Config'
import ModItem from './components/ModItem'

function App() {
  const [tela, setTela] = useState('carregando')
  const [mods, setMods] = useState([])

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
  }

  return (
    <>
      <button onClick={salvarMods}>Salvar</button>
      {mods.map((mod) => (
        <ModItem
          key={mod.chave}
          nome={mod.nome}
          ativo={mod.ativo}
          onToggle={() => toggleMod(mod.chave)}
        />
      ))}
    </>
  )
}

export default App
