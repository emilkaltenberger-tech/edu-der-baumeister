const photos = [...document.querySelectorAll(".photo")];
const expand = document.querySelector(".expand");
let expanded = false;
function showSelection() {
  photos.slice(4).forEach(photo => { photo.hidden = !expanded; });
  expand.textContent = expanded ? "Auswahl verkleinern" : "Alle 12 Fotos ansehen";
  expand.setAttribute("aria-expanded", String(expanded));
}
expand.hidden = false;
expand.addEventListener("click", () => {
  expanded = !expanded;
  showSelection();
});
showSelection();

document.querySelector(".contact form").addEventListener("submit", event => {
  event.preventDefault();
  const values = new FormData(event.currentTarget);
  const body = values.get("Vorhaben") + "\n\n" + values.get("Name") + "\n" + values.get("E-Mail");
  location.href = "mailto:dorfstetter.scholze@gmail.com?subject=Projektanfrage&body=" + encodeURIComponent(body);
});

const hero = document.querySelector(".dispatch");
const choices = [...hero.querySelectorAll('input[name="baumotiv"]')];
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
let manuallySelected = false;
let inView = false;
let timer;

function schedule() {
  clearTimeout(timer);
  if (manuallySelected || reduced.matches || document.hidden || !inView) return;
  timer = setTimeout(() => {
    const active = choices.findIndex(choice => choice.checked);
    choices[(active + 1) % choices.length].checked = true;
    schedule();
  }, 6500);
}

function stopRotation() {
  manuallySelected = true;
  clearTimeout(timer);
}

hero.querySelector(".chapter-nav").addEventListener("click", stopRotation);
hero.addEventListener("change", stopRotation);
hero.addEventListener("focusin", event => {
  if (event.target.matches(":focus-visible")) stopRotation();
});
document.addEventListener("visibilitychange", schedule);
reduced.addEventListener("change", schedule);
new IntersectionObserver(([entry]) => {
  inView = entry.isIntersecting;
  schedule();
}).observe(hero);

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#hauptnavigation");
menuToggle.hidden = false;
function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
}
menuToggle.addEventListener("click", () => {
  menuToggle.setAttribute("aria-expanded", String(menuToggle.getAttribute("aria-expanded") !== "true"));
});
navigation.addEventListener("click", closeMenu);
document.addEventListener("pointerdown", event => {
  if (!event.target.closest("header")) closeMenu();
});
document.addEventListener("focusin", event => {
  if (!event.target.closest("header")) closeMenu();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    closeMenu();
    if (menuToggle.offsetWidth) menuToggle.focus();
  }
});
