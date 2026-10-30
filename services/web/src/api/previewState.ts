import type { ViewState } from "./types";

const validStates: ViewState[] = ["data", "loading", "error", "empty"];
export function getPreviewState(): ViewState {
  if (!import.meta.env.DEV) return "data";
  const value =
    new URLSearchParams(window.location.search).get("previewState") ??
    localStorage.getItem("previewState");
  return value && validStates.includes(value as ViewState)
    ? (value as ViewState)
    : "data";
}

export function setPreviewState(state: ViewState): void {
  localStorage.setItem("previewState", state);
  const url = new URL(window.location.href);
  url.searchParams.set("previewState", state);
  window.history.replaceState({}, "", url);
  window.dispatchEvent(new Event("preview-state-change"));
}
