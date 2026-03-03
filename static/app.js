
import { render, navigateTo } from "./router.js";

document.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigateTo(e.target.href);
  }
});

// Intercepter les clics sur la navbar
window.addEventListener("popstate", render);

render();
