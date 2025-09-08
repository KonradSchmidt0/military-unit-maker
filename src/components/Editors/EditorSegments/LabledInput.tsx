interface props {
  label: string
  value: string | number | readonly string[] | undefined
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  id?: string
  type?: React.HTMLInputTypeAttribute
}

export function LabledInput(p: props) {
  return (
    <label className="flex flex-row items-center gap-2 w-full">
      <span className="font-bold whitespace-nowrap">{p.label}</span>
      <input
        id={p.id}
        type={p.type ?? "text"}
        value={p.value}
        onChange={p.onChange}
        className="editor-element flex-1 min-w-0" // By default, the browser sets min-w to auto, meaning flex-1 cant actually shrink it
      />
    </label>
  )
}