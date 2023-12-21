function showToast(type, message) {
    const toastContainer = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerText = message;

    toastContainer.appendChild(toast);
    toast.classList.add("fadeIn");

    setTimeout(() => {
        toast.classList.remove("fadeIn");
        toast.classList.add("fadeOut");

        // Wait for the fadeOut animation to complete before removing the element
        toast.addEventListener(
            "animationend",
            () => {
                toast.remove();
            },
            { once: true }
        );
    }, 5000);
}
