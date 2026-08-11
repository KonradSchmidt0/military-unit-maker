interface props {
  children: React.ReactNode
  pos: {top: number, left: number}
}

// Sufficient
const approximateHeight = 273
const approximateWidth = 284
const padding = 8

export default function MouseDropdown(p:props) {
  const isMobile = "ontouchstart" in window

  const pos = isMobile ? {top: padding, left: window.innerWidth / 2 - approximateWidth / 2} : CalculateClampedPos(p.pos.top, p.pos.left)

  return (
    <div 
      className="editor-box !absolute !z-10  dark:!bg-bg !bg-white !border-r-2 rounded-lg transition-colors" 
      style={{ top: pos.top, left: pos.left  }}
    >
      {p.children}
    </div>
  );
}

function CalculateClampedPos(top: number, left: number) {
  /// Problem: The dropdown menu can overflow, breaking the height and/or width limits of our page
  /// Solution: Clamp it
  const t = Math.min(top, window.innerHeight - approximateHeight - padding)
  const l = Math.min(left - approximateWidth / 2, window.innerWidth - approximateWidth - padding)

  return {top: Math.max(t, padding), left: Math.max(l, padding)}
}