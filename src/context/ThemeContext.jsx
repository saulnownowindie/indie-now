import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "theme-preference";

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    const initial =
      saved === "light" || saved === "dark"
        ? saved
        : getSystemTheme();

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(initial);

    return initial;
  });

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    media.addEventListener("change", handleChange);

    return () =>
      media.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme =
      theme === "dark"
        ? "light"
        : "dark";

    localStorage.setItem(STORAGE_KEY, nextTheme);

    setTheme(nextTheme);
  };

  const resetThemeToSystem = () => {
    localStorage.removeItem(STORAGE_KEY);

    setTheme(getSystemTheme());
  };

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      resetThemeToSystem,
      setTheme,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}