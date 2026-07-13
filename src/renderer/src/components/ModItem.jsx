function ModItem({ nome, ativo, imagem, onToggle, onExcluir }) {
  const excluirClique = (event) => {
    event.stopPropagation()
    onExcluir()
  }

  return (
    <div
      onClick={onToggle}
      className="relative flex items-center justify-between px-4 py-3 h-16 rounded-lg border border-neutral-800 bg-neutral-900 hover:border-amber-600/50 cursor-pointer transition-colors overflow-hidden"
    >
      {imagem && (
        <div
          style={{
            backgroundImage: `url(${imagem})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          className="absolute right-25 top-0 bottom-0 w-20"
        />
      )}

      <div className="relative">
        <p className="text-neutral-100 font-medium">{nome}</p>
        <div
          onClick={(event) => {
            event.stopPropagation()
            onToggle()
          }}
          className={`mt-1 w-11 h-6 rounded-full p-1 cursor-pointer transition-colors ${
            ativo ? 'bg-amber-600' : 'bg-neutral-700'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transition-transform ${
              ativo ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </div>
      </div>

      <button
        onClick={excluirClique}
        className="relative text-neutral-500 hover:text-red-400 text-sm px-2 py-1 transition-colors"
      >
        Excluir
      </button>
    </div>
  )
}

export default ModItem
