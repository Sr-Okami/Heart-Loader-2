/* eslint-disable react/prop-types */
function ModItem(props) {
  return (
    <div onClick={props.onToggle}>
      <p>{props.nome}</p>
      <p>{props.ativo ? 'Ativado' : 'Desativado'}</p>
    </div>
  )
}

export default ModItem