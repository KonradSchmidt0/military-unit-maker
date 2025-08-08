import { useEffect, useState } from 'react';
import { useThemeStore } from '../../../hooks/useThemeStore';

export default function ThemeToggle() {
  const {isDark, setDark} = useThemeStore();

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
      onClick={() => setDark(!isDark)}
    >
      {isDark ? '☀️📺' : '🌒📺'}
    </button>
  );
}
