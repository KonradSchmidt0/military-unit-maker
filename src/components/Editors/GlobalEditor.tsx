export default function GlobalEditor() {
  return (
    <div className="editor-box">
      <div className="border-slate-400 border-b-2 border-dashed p-2 text-center font-bold">
        GLOBAL SETTINGS
      </div>
      <div className="border-slate-400 border-b-2 border-dashed p-2 flex flex-col gap-2 items-center">
        <button className="btn-editor">Custom Global Setting Button</button>
        <button className="btn-editor">Click Me!</button>
      </div>
    </div>
  )
}