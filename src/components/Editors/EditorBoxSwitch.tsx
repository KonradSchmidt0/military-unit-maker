interface EditorBoxSwitchProps {
  children: any
  onClick?: () => void
}

export default function EditorBoxSwitch(p: EditorBoxSwitchProps) {
  return (
    <div className="editor-segment !border-2">
      <button className="btn-emoji" onClick={p.onClick}>{p.children}</button>
    </div>
  )
}