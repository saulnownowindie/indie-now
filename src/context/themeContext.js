import { createContext, useContext } from "react";

const ThemeContext = createContext(null);

export function useThemeContext() {
  return useContext(ThemeContext);
}

export default ThemeContext;
