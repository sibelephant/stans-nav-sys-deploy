import { useEffect, useMemo, useState } from "react";
import {
  FluentProvider,
  createDarkTheme,
  createLightTheme,
  type BrandVariants,
} from "@fluentui/react-components";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Shell } from "../components/Shell";
import { WorkspacePage } from "../features/navigation/WorkspacePage";
import { EditorPage } from "../features/graph-editor/EditorPage";
import { InsightsPage } from "../features/insights/InsightsPage";

const brandRamp: BrandVariants = {
  10: "#002b30",
  20: "#004b52",
  30: "#00646c",
  40: "#087e8b",
  50: "#188c98",
  60: "#329aa5",
  70: "#4ea8b1",
  80: "#69b6bf",
  90: "#83c4cb",
  100: "#9dd2d7",
  110: "#b7dfe3",
  120: "#cdebee",
  130: "#dff1f3",
  140: "#edf7f8",
  150: "#f5fbfb",
  160: "#ffffff",
};
type ThemeMode = "light" | "dark" | "system";

function initialTheme(): ThemeMode {
  const saved = localStorage.getItem("app-theme");
  return saved === "light" || saved === "dark" || saved === "system"
    ? saved
    : "system";
}

export function App() {
  const [mode, setMode] = useState<ThemeMode>(initialTheme);
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const isDark = mode === "dark" || (mode === "system" && systemDark);
  useEffect(() => localStorage.setItem("app-theme", mode), [mode]);
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (event: MediaQueryListEvent) =>
      setSystemDark(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);
  const theme = useMemo(
    () => (isDark ? createDarkTheme(brandRamp) : createLightTheme(brandRamp)),
    [isDark],
  );
  return (
    <FluentProvider theme={theme} className="min-h-screen">
      <Shell
        dark={isDark}
        onToggleTheme={() => setMode(isDark ? "light" : "dark")}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <Routes location={location}>
              <Route path="/" element={<WorkspacePage />} />
              <Route path="/editor" element={<EditorPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Shell>
    </FluentProvider>
  );
}
