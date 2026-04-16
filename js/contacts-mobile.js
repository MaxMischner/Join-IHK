/** Mobile : when click 3 points button */
function openButtonOverlay(event) {
    buttonOverlay.classList.remove("d-none");
}


/** Mobile : close 3 points button overlay */
function closeButtonOverlay(event) {
    if (event.target !== event.currentTarget) return;
    buttonOverlay.classList.add("d-none");
    event.stopPropagation();
}


/** Mobile : show contact detail */
function openContactDetail() {
    isOpenContactDetail = true;
    contactLeftDiv.classList.add("d-none");
    contactRightDiv.classList.remove("d-none");
}


/** Mobile : from contact detail back to contact list */
function goContactList() {
    isOpenContactDetail = false;
    buttonOverlay.classList.add("d-none");
    if (isMobile) {
        contactLeftDiv.classList.remove("d-none");
        contactRightDiv.classList.add("d-none");
    }
}


/** Mobile : handle layout on window resize */
addEventListener("resize", (event) => {});
onresize = (event) => {
    showSidebarBottom();
    if (window.innerWidth <= 1100) {
        isMobile = true;
        if (!isOpenContactDetail) contactRightDiv.classList.add("d-none");
        else {
            contactRightDiv.classList.remove("d-none");
            contactLeftDiv.classList.add("d-none");
        }
    } else {
        isMobile = false;
        contactRightDiv.classList.remove("d-none");
        contactLeftDiv.classList.remove("d-none");
    }
};
