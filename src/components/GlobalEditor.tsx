export default function GlobalEditor() {
  return (
    <div className="border-slate-400 border-2 w-64">
      <div className="border-slate-400 border-b-2 border-dashed p-2 text-center">
        GLOBAL SETTINGS
      </div>
      <div className="border-slate-400 border-b-2 border-dashed p-2 w-64">
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          <span>Custom Global Setting Check</span>
        </label>
        <button className="mt-2 p-2 bg-slate-400 text-black hover:text-white rounded hover:bg-lime-700">Custom Global Setting Button</button>
      </div>
    </div>
  )
}