import { useThemeStore } from '../../../hooks/useThemeStore';

export default function ThemeToggle() {
  const {isDark, setDark} = useThemeStore();

  return (
    <button
      className="btn-emoji"
      onClick={() => setDark(!isDark)}
    >
      {isDark ? '☀️📺' : '🌒📺'}
    </button>
  );
}
