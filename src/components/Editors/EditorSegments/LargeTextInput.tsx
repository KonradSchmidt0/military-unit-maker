interface LargeTextInputProps {
  topText?: string
  value: string
  onChange: (e: any) => void
}

export function LargeTextInput( {topText, value, onChange} : LargeTextInputProps) {
  return <div className="editor-segment-flex !border-0">
    {topText && <div className="editor-segment-row">
      <label className="font-bold" htmlFor="lti">{topText}</label>
    </div>}
    <div className="editor-segment-row">
      <textarea id="lti" value={value} onChange={onChange} rows={2} className="editor-element"/>
    </div>
  </div>
}