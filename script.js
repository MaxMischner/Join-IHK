let initialNamesDiv = document.getElementById("initialNames");

/** Show initials on top right corner */
function initInitials () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const state = urlParams.get('state');

    let user = localStorage.getItem("activeUser");
    let guestUser = localStorage.getItem("guestUser");
    if (!user && !guestUser && state != "0") {
        window.location.href = "index.html";
        return ;
    } 
    let activeUser = JSON.parse(localStorage.getItem("activeUser"));   
    renderInitials(activeUser);
}

/**
 * Renders the initials of the active user into the DOM.
 * 
 * If no user is active, a default letter "G" is shown.
 * If a user is present, the initials are generated from the user's name.
 * 
 * @param {Array<Object>} activeUser - An array with one user object that contains a `name` property.
 * @property {string} activeUser[].name - The full name of the active user (e.g., "John Doe").
 */
function renderInitials(activeUser) {
    if (!activeUser) {
        document.getElementById('initialNames').innerHTML = "G"; 
   }else {
        let originalName = activeUser[0].name;
        let initials = originalName.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase();
        document.getElementById('initialNames').innerHTML = initials; 
    }
}


/* Close Menu Overlay 
 * @param {*} event tiggered event
*/
function closeOverlay(event) {
    
    initialNamesDiv.style.background = "white";
    initialNamesDiv.style.color = "rgb(41, 171, 226)";

    let overlay = document.getElementById("overlay");
    overlay.classList.add("d-none");

    event.stopPropagation();
}

/**
 * Open Menu overlay
 * @param {*} event tiggered event
 */
function openOverlay(event) {
    initialNamesDiv.style.background = "rgb(41, 171, 226)"
    initialNamesDiv.style.color = "white";

    let overlay = document.getElementById("overlay");
    overlay.classList.remove("d-none");

    event.stopPropagation();
}


/** Check if user already log in */
function getUser() {
    let user = localStorage.getItem("activeUser");
    let guestUser = localStorage.getItem("guestUser");
    if (!user && !guestUser) {
        window.location.href = "log_in.html";
        return ;
    } 

    let activeUser = JSON.parse(user);   
    renderInitials(activeUser);
}


/**
 * Get two letters of name
 * @param {} name 
 * @returns 
 */
function extracNameInitials(name) {
    let arr = name.split(" ");
    let initialsStr = ""
    arr.forEach(n => {
        if (n.length) {
            initialsStr += n.at(0).toUpperCase();
        }
    });
    if(initialsStr.length > 2) initialsStr = initialsStr.slice(0, 2);
    return initialsStr;
}


/** User Logout */
function logout() {
    localStorage.removeItem("activeUser");
    localStorage.removeItem("guestUser");
    window.location.href = "index.html";
}

/** generate a random color */ 
function generateLightColor() {
    const hue = Math.floor(Math.random() * 360); 
    const saturation = Math.floor(Math.random() * 30) + 70; 
    const lightness = Math.floor(Math.random() * 20) + 75; 
  
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

