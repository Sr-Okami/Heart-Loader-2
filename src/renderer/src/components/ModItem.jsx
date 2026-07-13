function ModItem({ nome, ativo, imagem, onToggle, onExcluir }) {
  const excluirClique = (event) => {
    event.stopPropagation()
    onExcluir()
  }

  return (
    <div
      onClick={onToggle}
      className="relative w-full h-full rounded-lg border border-neutral-800 bg-neutral-900 hover:border-amber-600/50 cursor-pointer transition-colors overflow-hidden group"
    >
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 bg-neutral-800 overflow-hidden relative">
          {imagem ? (
            <div
              style={{
                backgroundImage: `url(${imagem})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              className="w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-600 text-sm">
              Sem imagem
            </div>
          )}

          <div
            className={`absolute top-2 right-2 w-3 h-3 rounded-full shadow-lg ${
              ativo ? 'bg-green-500' : 'bg-neutral-500'
            }`}
          />
        </div>

        <div className="shrink-0 p-3 bg-neutral-900">
          <div className="flex items-start justify-between gap-2">
            <p className="text-neutral-100 font-medium text-sm truncate flex-1">{nome}</p>

            <button
              onClick={excluirClique}
              className="text-neutral-500 hover:text-red-400 transition-colors text-xs font-medium px-2 py-0.5 rounded border border-neutral-700 hover:border-red-400 shrink-0"
            >
              ✕
            </button>
          </div>

          <div
            onClick={(event) => {
              event.stopPropagation()
              onToggle()
            }}
            className={`mt-2 w-11 h-6 rounded-full p-1 cursor-pointer transition-colors ${
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
      </div>
    </div>
  )
}

export default ModItem
