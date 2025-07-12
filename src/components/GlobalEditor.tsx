export default function GlobalEditor() {
  return (
    <div className="border-slate-400 border-2 border-l-0 w-64">
      <div className="border-slate-400 border-b-2 border-dashed p-2 text-center">
        GLOBAL SETTINGS
      </div>
      <div className="border-slate-400 border-b-2 border-dashed p-2 flex flex-col gap-2 items-center">
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          <span>Custom Global Setting Check</span>
        </label>
        <button className="btn-editor">Custom Global Setting Button</button>
        <button className="btn-editor">Click Me!</button>
      </div>
    </div>
  )
}