function initEvents() {
  DOM.contactNameEl.addEventListener("input", () => {
    DOM.warningMessageNameEl.textContent = "";
  });

  DOM.contactEmailEl.addEventListener("input", () => {
    DOM.warningMessageEmailEl.textContent = "";
  });

  DOM.contactPhoneEl.addEventListener("input", () => {
    DOM.warningMessagePhoneEl.textContent = "";
  });

  DOM.dialogEl.addEventListener("click", (event) => {
    if (event.target === DOM.dialogEl) {
      closeDialog();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.target.classList.contains("contact") &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      event.target.click();
    }
  });
}
