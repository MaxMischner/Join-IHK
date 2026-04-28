const sidebarBottom = document.getElementById("sidebar-bottom");


/** if show sidebar bottom */
function showSidebarBottom () {
    
    if (window.innerWidth <= 1024) {
        sidebarBottom.style.display = "none";
    } else {
        sidebarBottom.style.display = "block";
    }
}
showSidebarBottom ();


/** resize screen */
addEventListener("resize", (event) => {});
onresize = (event) => {
    showSidebarBottom ();
};