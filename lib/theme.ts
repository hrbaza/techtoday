// Where the reader's light/dark choice is saved. Shared by the toggle button
// and the inline script in app/layout.tsx that applies it before first paint.
export const THEME_STORAGE_KEY = "tt-theme";

export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`;
