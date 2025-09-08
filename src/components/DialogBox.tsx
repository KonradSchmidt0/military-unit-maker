import { useDialogBoxStorage } from "../hooks/useDialogBoxStore";

interface props {

}

export function DialogBox(p: props) {
  const { isOpen, header, longText, options, close } = useDialogBoxStorage()
  
  if (!isOpen)
    return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="dark:bg-bg bg-primary w-2xl max-h-[80vh] rounded-xl shadow-lg p-6 relative overflow-y-auto flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">{header}</h2>
        <div className="space-y-4 text-base mb-4">{longText}</div>

        <div className="flex flex-col sm:flex-row gap-2">
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => {
                opt.action()
                close()
              }}
              className="btn-dialog min-w-32 min-h-12 flex-1"
            >
              {opt.text}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}