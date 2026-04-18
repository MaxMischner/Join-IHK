let activeUser = [];
const email = document.getElementById('loginEmail');
const password = document.getElementById('loginPassword');
const errorMSG = document.getElementById('error-msg');


/** Validate Email */
function validateLoginEmail() {
    if (!email.value.trim())  {
        errorMSG.innerText = "The email address cannot be empty";
        return false;
    }

    let patt = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(!patt.test(email.value.trim())) {
        errorMSG.innerText = "Please fill up a valid email address.";
        return false;
    }

    return true;
}


/** Validate password */
function validateLoginPassword() {
    if (!password.value.trim())  {
        errorMSG.innerText = "Password cannot be empty";
        return false;
    }
    return true;
}


/**
 * Checks if a user is registered and logs them in.
 */
async function login() {
    if(!validateLoginEmail() || !validateLoginPassword()) {
        errorMSG.style.visibility = "visible";
        return false;
    }
    const { data: users, error } = await db.from('users').select('*')
        .eq('email', email.value)
        .eq('password', password.value);
    if (error) { console.error(error); return; }
    let user = users && users.length > 0 ? users[0] : null;
    if (user) {
        activeUser.push(user);
        localStorage.setItem("activeUser", JSON.stringify(activeUser));
        window.location.href = "summary.html";
    } else {
        wrongLogin();
    }
}

/**
 * Displays an info text if the login credentials are incorrect.
 */
function wrongLogin() {
    const existingWarning = document.getElementById('error-msg');
    if (!existingWarning) return;

    existingWarning.innerText = 'Email or password incorrect';
    existingWarning.style.visibility = "visible";
}


/** Clear error message */
function clearErrorMsg () {
    errorMSG.style.visibility = "hidden";
    errorMSG.innerText = "";
}


/**
 * Forwards an user without login to the summary-site.
 */
function guestLogin() {
    localStorage.removeItem("activeUser");
    localStorage.setItem("guestUser", "guest")
    window.location.href = "summary.html";
}
