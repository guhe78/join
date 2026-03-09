document.addEventListener("DOMContentLoaded", () => {


    const closeAll = () => {
        document.querySelectorAll(".custom-select.open").forEach(s => s.classList.remove("open"));
    };


    document.querySelectorAll(".custom-select .select-trigger").forEach(trigger => {
        trigger.addEventListener("click", (e) => {
            e.stopPropagation();
            const select = trigger.closest(".custom-select");
            const isOpen = select.classList.contains("open");
            closeAll();
            if (!isOpen) select.classList.add("open");
        });
    });


    document.addEventListener("click", () => closeAll());


    const assigned = document.querySelector("#assignedSelect");
    if (assigned) {
        const dropdown = assigned.querySelector(".select-dropdown");
        const textEl = assigned.querySelector(".trigger-text");

        dropdown.addEventListener("click", (e) => {
            const option = e.target.closest(".select-option");
            if (!option) return;

            const cb = option.querySelector('input[type="checkbox"]');
            if (!cb) return;

            if (e.target !== cb) cb.checked = !cb.checked;
            option.classList.toggle("active", cb.checked);

            const count = dropdown.querySelectorAll('input[type="checkbox"]:checked').length;
            textEl.textContent = count === 0 ? "Select contacts to assign" : `${count} selected`;
        });
    }


    const cat = document.querySelector("#catSelect");
    if (cat) {
        const dropdown = cat.querySelector(".select-dropdown");
        const textEl = cat.querySelector(".trigger-text");
        const hidden = document.querySelector("#catHidden");

        dropdown.addEventListener("click", (e) => {
            const option = e.target.closest(".select-option");
            if (!option) return;


            dropdown.querySelectorAll(".select-option").forEach(o => o.classList.remove("active"));
            option.classList.add("active");


            textEl.textContent = option.textContent.trim();
            if (hidden) hidden.value = option.dataset.value || option.textContent.trim();


            cat.classList.remove("open");
        });
    }

});