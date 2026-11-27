// Mobile navigation drawer: a modal <dialog> whose sheet sits in a
// horizontal scroll-snap container, so the swipe gesture is native.

const drawer = document.getElementById("drawer");
const openBtn = document.getElementById("drawer-open");
const closeBtn = document.getElementById("drawer-close");

if (drawer instanceof HTMLDialogElement && openBtn && closeBtn) {
  const scroller = drawer.querySelector<HTMLElement>(".Drawer-scroller")!;
  const sheet = drawer.querySelector<HTMLElement>(".Drawer-sheet")!;

  const openDrawer = async () => {
    drawer.showModal();
    if (!CSS.supports("scroll-initial-target", "nearest")) {
      scroller.scrollTo({ left: scroller.offsetWidth, behavior: "instant" });
      await new Promise((r) =>
        requestAnimationFrame(() => requestAnimationFrame(r)),
      );
    }
    scroller.scrollTo({ left: 0, behavior: "auto" });
  };

  const closeDrawer = () => {
    // The observer closes the dialog once the sheet has left the screen.
    scroller.scrollTo({ left: scroller.offsetWidth, behavior: "auto" });
  };

  const visibleThreshold = 1 / window.innerWidth;
  new IntersectionObserver(
    (entries) => {
      const entry = entries.at(-1);
      if (!entry || !drawer.open) return;
      if (entry.intersectionRatio < visibleThreshold) {
        drawer.close();
        openBtn.setAttribute("aria-expanded", "false");
      } else if (entry.intersectionRatio === 1) {
        openBtn.setAttribute("aria-expanded", "true");
      }
    },
    { root: drawer, threshold: [visibleThreshold, 1] },
  ).observe(sheet);

  openBtn.addEventListener("click", openDrawer);
  closeBtn.addEventListener("click", closeDrawer);

  // Tap on the dimmed area closes it.
  drawer.addEventListener("click", (event) => {
    if (!sheet.contains(event.target as Node)) closeDrawer();
  });

  // Escape slides it out instead of closing instantly.
  drawer.addEventListener("cancel", (event) => {
    if (event.cancelable) {
      event.preventDefault();
      closeDrawer();
    }
  });

  // Fallback for the backdrop fade without scroll-driven animations.
  if (!CSS.supports("animation-timeline: scroll()")) {
    scroller.addEventListener("scroll", () => {
      const ratio = 1 - scroller.scrollLeft / sheet.offsetWidth;
      drawer.style.setProperty("--drawer-backdrop", String(ratio));
    });
  }

  // Desktop shows the sidebar: never leave the drawer open there.
  matchMedia("(width >= 64rem)").addEventListener("change", (e) => {
    if (e.matches && drawer.open) {
      drawer.close();
      openBtn.setAttribute("aria-expanded", "false");
    }
  });
}
