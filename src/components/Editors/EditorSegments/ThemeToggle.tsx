import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button
      className="btn-emoji"
      onClick={() => setIsDark(!isDark)}
    >
      {isDark ? '☀️📺' : '🌒📺'}
    </button>
  );
}
