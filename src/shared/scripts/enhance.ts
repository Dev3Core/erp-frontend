// Progressive enhancement. Every page works without this script: forms post
// to the server and dialogs fall back to the invokers polyfill.

// Invoker commands (command / commandfor) for opening dialogs.
if (!("commandForElement" in HTMLButtonElement.prototype)) {
  import("invokers-polyfill");
}

// --- Validation: keep aria-invalid in sync with :user-invalid -------------

const announcer = document.createElement("div");
announcer.setAttribute("aria-live", "polite");
announcer.className = "visually-hidden";
document.body.append(announcer);
let announceTimer: ReturnType<typeof setTimeout> | undefined;

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
const isField = (el: EventTarget | null): el is Field =>
  el instanceof HTMLInputElement ||
  el instanceof HTMLSelectElement ||
  el instanceof HTMLTextAreaElement;

const linkError = (el: Field, shown: boolean) => {
  const errorId = el.dataset.error;
  if (!errorId) return;
  const ids = (el.getAttribute("aria-describedby") ?? "")
    .split(/\s+/)
    .filter((id) => id && id !== errorId);
  if (shown) ids.push(errorId);
  if (ids.length) el.setAttribute("aria-describedby", ids.join(" "));
  else el.removeAttribute("aria-describedby");
};

const announced = new WeakSet<Field>();

const syncAria = (el: Field, announce = false) => {
  // A server-side error stays until the user edits the field.
  if (el.hasAttribute("data-server-error")) return;
  const invalid = el.matches(":user-invalid");
  el.setAttribute("aria-invalid", String(invalid));
  linkError(el, invalid);
  if (!invalid) {
    announced.delete(el);
    return;
  }
  if (announce && !announced.has(el)) {
    announced.add(el);
    const message = document.getElementById(el.dataset.error ?? "");
    const label = el.labels?.[0]?.textContent?.trim();
    if (message) {
      clearTimeout(announceTimer);
      announcer.textContent = "";
      announceTimer = setTimeout(() => {
        announcer.textContent = `${label ? `${label}: ` : ""}${message.textContent?.trim()}`;
      }, 500);
    }
  }
};

for (const el of document.querySelectorAll<Field>(
  "input:not([type=hidden]), select, textarea",
)) {
  if (!el.hasAttribute("aria-invalid"))
    el.setAttribute("aria-invalid", "false");
}

document.addEventListener(
  "blur",
  (e) => isField(e.target) && syncAria(e.target, true),
  true,
);
document.addEventListener(
  "change",
  (e) => isField(e.target) && syncAria(e.target, true),
  true,
);
document.addEventListener("input", (e) => {
  if (!isField(e.target)) return;
  if (e.target.hasAttribute("data-server-error")) {
    e.target.removeAttribute("data-server-error");
  }
  syncAria(e.target);
});
document.addEventListener(
  "invalid",
  (e) => {
    if (!isField(e.target)) return;
    announced.add(e.target);
    syncAria(e.target);
  },
  true,
);

// Custom validation messages, in Spanish, from data-* attributes.
document.addEventListener(
  "invalid",
  (e) => {
    const el = e.target;
    if (!(el instanceof HTMLInputElement)) return;
    const msg = el.validity.valueMissing
      ? el.dataset.msgRequired
      : el.validity.patternMismatch || el.validity.typeMismatch
        ? el.dataset.msgFormat
        : el.validity.tooShort
          ? el.dataset.msgShort
          : undefined;
    if (msg) el.setCustomValidity(msg);
  },
  true,
);
document.addEventListener("input", (e) => {
  if (e.target instanceof HTMLInputElement) e.target.setCustomValidity("");
});

// --- Prevent double submission ----------------------------------------------

document.addEventListener("submit", (e) => {
  const form = e.target as HTMLFormElement;
  if (form.method === "dialog") return;
  const submitter = e.submitter;
  if (!(submitter instanceof HTMLButtonElement)) return;
  // Wait a tick so the submitter's name/value is part of the submission.
  setTimeout(() => {
    submitter.disabled = true;
    submitter.setAttribute("aria-busy", "true");
  });
});

// Restore buttons when the page comes back from the bfcache.
window.addEventListener("pageshow", (e) => {
  if (!e.persisted) return;
  for (const btn of document.querySelectorAll<HTMLButtonElement>(
    "button[aria-busy=true]",
  )) {
    btn.disabled = false;
    btn.removeAttribute("aria-busy");
  }
});

// --- Show / hide password ---------------------------------------------------

document.addEventListener("click", (e) => {
  const btn = (e.target as Element).closest<HTMLButtonElement>(
    "[data-password-toggle]",
  );
  if (!btn) return;
  const input = document.getElementById(
    btn.getAttribute("aria-controls") ?? "",
  );
  if (!(input instanceof HTMLInputElement)) return;
  const show = btn.getAttribute("aria-pressed") !== "true";
  input.type = show ? "text" : "password";
  btn.setAttribute("aria-pressed", String(show));
});

// --- Reset dialog forms when a dialog closes --------------------------------

document.addEventListener(
  "close",
  (e) => {
    const dialog = e.target;
    if (!(dialog instanceof HTMLDialogElement)) return;
    dialog.returnValue = "";
    if (dialog.dataset.resetOnClose !== undefined) {
      dialog.querySelector("form")?.reset();
    }
  },
  true,
);
