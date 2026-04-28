/** Validate Email */
function validateEmail(value) {
    if (!value.trim())  {
        return [false, "The email address cannot be empty"];
    }

    let patt = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

    if(!patt.test(value.trim())) {
        return [false, "Please fill a valid email address."];
    }

    const domain = value.trim().split('@')[1];
    const domainWithoutTLD = domain.substring(0, domain.lastIndexOf('.'));
    if (!/[a-zA-Z]/.test(domainWithoutTLD)) {
        return [false, "Please fill a valid email address."];
    }

    return [true, ""];
}

/** Validate Username */
function validateUsername(value) {
    if (!value.trim())  {
        return [false, "The name cannot be empty"];
    }

    if(value.trim().length < 3) {
        return [false, "The name requires at least 3 letters."];
    }

    if (!/[a-zA-ZäöüÄÖÜß]/.test(value.trim())) {
        return [false, "The name must contain at least one letter."];
    }

    return [true, ""];
}

/** Validate Phone */
function validatePhone(value) {
    if (!value.trim())  {
        return [false, "The phone nummber cannot be empty"];
    }

    const patt = /^\+?[\d\s\-()/]{6,25}$/;
        
    if(!patt.test(value.trim())) {
        return [false, "Please fill a valid phone number."];
    }

    return [true, ""];
}


/** Valid 3 fields */
function validAllForm(nameField, emailField, phoneField, errorMSG) {
    
    let [bName, msgName] = validateUsername(nameField.value);
    if (!bName) {
        errorMSG.innerText = msgName;
        nameField.classList.add("red-border");
        return bName;
    }

    let [bEmail, msgEmail] = validateEmail(emailField.value);
    if (!bEmail) {
        errorMSG.innerText = msgEmail;
        emailField.classList.add("red-border");
        return bEmail;
    }

    let [bPhone, msgPhone] = validatePhone(phoneField.value);
    if (!bPhone) {
        errorMSG.innerText = msgPhone;
        phoneField.classList.add("red-border");
        return bPhone;
    }

    return true;
}