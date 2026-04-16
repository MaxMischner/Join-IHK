let queryedContacts = [];
let allContacts = [];
const contactListDIV = document.getElementById("contact-list");
const contactOverlay = document.getElementById("contact-overlay");
const contactDetailDIV = document.getElementById("contact-detail");
const contactRightDiv = document.getElementById("contact-right");
const contactLeftDiv = document.getElementById("contact-left");
const buttons = document.getElementById("contact-right-action-buttons");
const buttonOverlay = document.getElementById("button-overlay");
let prevLi;
let currentID = "";
let shouldChnageColor = currentID ? false : true;
let colorStr;
let isMobile = false;
let isOpenContactDetail = false;
let deleteInProgress = false;


/** Check if it is on mobile */
function initUI() {
    getUser();
    if (window.innerWidth <= 1100) {
        isMobile = true;
        contactRightDiv.classList.add("d-none");
        contactLeftDiv.classList.remove("d-none");
    }
}


/** Query all contacts from DB */
function initContact() {
    contactListDIV.innerHTML = "";
    queryedContacts = [];
    allContacts = [];
    initUI();
    queryContacts().then(() => {
        allContacts = [...queryedContacts];
        reconstructContactArray();
    });
}   


/** Put all contacts in order alphabetically */
function reconstructContactArray() {
    let obj = {};
    allContacts.forEach(contact => {
        let letter = contact.name.at(0).toUpperCase();
        
        if (Object.keys(obj).indexOf(letter) != -1) {
            let arr = obj[letter];
            arr.push(contact);
            obj[letter] = arr;
        } else {
            let arr = [contact];
            obj[letter] = arr;
        }
    });
    renderContactList(obj);
}


/** Show contact list in order of letter */
function renderContactList(obj) {
    let allKeys = Object.keys(obj).sort();
    let contactListDIVHTML = "";
    allKeys.forEach(key => {
        let listCardHTML = "";
        obj[key].forEach(contact => {
            let initials = extracNameInitials(contact.name);
            listCardHTML += getContactListCard(initials, contact.name, contact.email, contact.id, contact.color);
        });
        contactListDIVHTML += getConactLetterContainer(key, listCardHTML);
    });
    contactListDIV.innerHTML = contactListDIVHTML; 
    moveToEditedLi();
}


/** Show the currently editing name card */
function moveToEditedLi() {
    if (currentID) {
        const li = document.getElementById("contact-li-" + currentID);
        li.style.background = "var(--btn-color)";
        li.querySelector(".contact-name").style.color = "#fff";
        li.scrollIntoView({ behavior: "smooth"});
        prevLi = li;
    }
}


/** Fetch contacts from DB */
async function queryContacts() {
    const { data, error } = await db.from('contacts').select('*');
    if (error) { console.error('Error fetching contacts:', error); return; }
    if (data) queryedContacts = [...data];
}


/**
 * When user click a contact card on contact list
 * @param {string} id 
 */
function clickContactCard(id) {
    if (isMobile)  openContactDetail();

    let li = document.getElementById("contact-li-" + id);
    currentID = id;
    if (prevLi) {
        prevLi.style.background = "";
        prevLi.querySelector(".contact-name").style.color = "#000";
    }
    li.style.background = "var(--btn-color)";
    prevLi = li;
    li.querySelector(".contact-name").style.color = "#fff";
    
    renderContactDetail(li.getAttribute("contactID"));
}


/** When user click a contact card on contact list, detail should be shown
 * @param {string} id contact id
 */
function renderContactDetail(id) {
    const cont = allContacts.filter(c => c.id == id)[0];
    contactDetailDIV.innerHTML = getConactDetail(extracNameInitials(cont.name), cont.name, cont.email, cont.phone, id, cont.color);
}


/** When user crate a new contact */
function addNewConact() {
    contactDetailDIV.innerHTML = "";

    if (prevLi) {
        prevLi.style.background = "";
        prevLi.querySelector(".contact-name").style.color = "#000";
    }

    currentID = "";
    shouldChnageColor = true;

    contactOverlay.classList.remove("d-none");
    contactOverlay.innerHTML = getAddContact();
}


/** When user edit a contact */
function editContact(e) {
    if(e) e.stopPropagation();

    buttonOverlay.classList.add("d-none");

    shouldChnageColor = false;
    contactOverlay.classList.remove("d-none");
    const cont = allContacts.filter(c => c.id == currentID)[0];
    contactOverlay.innerHTML = getEditContact(extracNameInitials(cont.name), cont.name, cont.email, cont.phone, cont.color, currentID);
}

/** Clear all fields on edit contact */
function clearEditContact() {
    const nameField = document.getElementById("edit-contact-name");
    const emailField = document.getElementById("edit-contact-email");
    const phoneField = document.getElementById("edit-contact-phone");
    const initialsDIV = document.getElementById("edit-contact-intitals");

    nameField.value = "";
    emailField.value = "";
    phoneField.value = "";
    initialsDIV.style.background = "var(--bg-gray)";
    initialsDIV.querySelector("span").innerText = "";
    initialsDIV.querySelector("img").style.display = "block";
}


/** Control delete btn */
function afterDelete() {
    document.body.removeChild(document.getElementById("notification-id"));
    contactDetailDIV.innerHTML = "";
    currentID = "";
    initContact();
    goContactList();
}


/** When user delete a contact */
async function deleteContact(e){
    closeContactOverlay(e);
    if (deleteInProgress) return;
    deleteInProgress = true;
    const deleteBtn = document.querySelector(".contact-detail-delete");
    deleteBtn.disabled = true;
    const { error } = await db.from('contacts').delete().eq('id', currentID);
    deleteBtn.disabled = false;
    deleteInProgress = false;
    if (!error) {
        document.body.appendChild(getNotification("Contact successfully deleted"));
        setTimeout(() => {
            afterDelete();
        }, 1000);
    }
}


/** Get form fields */ 
function getFormFields() {
    const nameField = document.getElementById("edit-contact-name");
    const emailField = document.getElementById("edit-contact-email");
    const phoneField = document.getElementById("edit-contact-phone");

    return [nameField, emailField, phoneField];
}
/**
 * When user click save or create contact
 * @param {object} e current event
 */
async function saveEditContact(e) {
    e.preventDefault();

    [nameField, emailField, phoneField] = getFormFields();
    const errorMSG = document.getElementById("edit-contact-error");
    if (!validAllForm(nameField, emailField, phoneField, errorMSG)) {errorMSG.style.display = "block"; return;}
    const initialsDIV = document.getElementById("edit-contact-intitals");
   
    let user = allContacts.find(c => (c.email == emailField.value && c.id != currentID));
    if(user) {
        errorMSG.style.display = "block";
        errorMSG.innerText = "The email is already used.";
        emailField.classList.add("red-border");
    } else {
        let data = {email:emailField.value.trim(), name:nameField.value.trim(), phone:phoneField.value.trim() , color:initialsDIV.style.backgroundColor}
        putContact(data, currentID, e);
    }
}


/**
 * Add or update contact in DB
 * @param {String} id id is only to be passed by updating contact.
 * @param {object} data {email, name, phone, color}
 */
async function putContact(data, id="", e) {
    let btn = e.target.querySelector(".edit-contact-bottom-save");
    btn.disabled = true;

    let resultId;
    if (id) {
        const { error } = await db.from('contacts').update(data).eq('id', id);
        if (error) { console.error(error); btn.disabled = false; return; }
        resultId = id;
    } else {
        const { data: inserted, error } = await db.from('contacts').insert(data).select().single();
        if (error) { console.error(error); btn.disabled = false; return; }
        resultId = inserted.id;
    }

    btn.disabled = false;
    contactOverlay.classList.add("d-none");
    currentID = resultId;
    updatePageInfo();
}


/** Update contact list and contact detail */
function updatePageInfo() {
    const nameField = document.getElementById("edit-contact-name");
    const emailField = document.getElementById("edit-contact-email");
    const phoneField = document.getElementById("edit-contact-phone");
    const initialsDIV = document.getElementById("edit-contact-intitals");

    initContact();
    updateContactDetail(initialsDIV.style.backgroundColor, initialsDIV.querySelector("span").innerText, nameField.value, emailField.value, phoneField.value);
}


/**
 * Update contact detail page info
 * @param {string} bgColor the name inital background color
 * @param {string} inital  the name inital itslef
 * @param {string} name  the name
 * @param {string} email the email
 * @param {string} phone the phone
 */
function updateContactDetail(bgColor, inital, name, email, phone){
    if (contactDetailDIV.innerHTML == "") {
        contactDetailDIV.innerHTML = getConactDetail("", "", "", "", "", "");
    }

    const detailLogo = document.getElementById("contact-detail-header-logo");
    if (detailLogo) {
        const detailName = document.getElementById("contact-detail-name");
        const detailEmail = document.getElementById("contact-detail-email");
        const detailphone = document.getElementById("contact-detail-phone");

        detailLogo.style.backgroundColor = bgColor;
        detailLogo.innerText = inital;
        detailName.innerText = name;
        detailEmail.innerText = email;
        detailphone.innerText = phone;
    }
}


/** Close contact overlay */
function closeContactOverlay(event) {
    if (event.target !== event.currentTarget) return;
    let overlay = document.getElementById("contact-overlay");
    overlay.classList.add("d-none");
    event.stopPropagation();
}


/** When user input in contact-name filed */
function editChangeName() {
    clearErrorMsg();
    const nameField = document.getElementById("edit-contact-name");
    const initialsDIV = document.getElementById("edit-contact-intitals");
    const valueStr = String(nameField.value);
    if (valueStr.length) {
        if (shouldChnageColor) {
            colorStr = generateLightColor();
            initialsDIV.style.background = colorStr;
        } 
        shouldChnageColor = false;
        hideInitalPlaceholderImage(initialsDIV, valueStr);
    } else {
        shouldChnageColor = true;
        showInitalPlaceholderImage(initialsDIV)
    }
}


/**
 * Hide default image 
 * @param {HTMLElement} initialsDIV element div
 */
function hideInitalPlaceholderImage(initialsDIV, valueStr) {
    initialsDIV.querySelector("span").innerText = extracNameInitials(valueStr);
    initialsDIV.querySelector("img").style.display = "none";
}


/**
 * Show default image 
 * @param {HTMLElement} initialsDIV element div
 */
function showInitalPlaceholderImage(initialsDIV) {
    initialsDIV.style.background = "var(--bg-gray)";
    initialsDIV.querySelector("span").innerText = "";
    initialsDIV.querySelector("img").style.display = "block";
}


/** Clear error message */
function clearErrorMsg() {
    const errorMSG = document.getElementById("edit-contact-error");
    errorMSG.style.display = "none";
    errorMSG.innerText = "";

    document.getElementById("edit-contact-name").classList.remove("red-border");
    document.getElementById("edit-contact-email").classList.remove("red-border");
    document.getElementById("edit-contact-phone").classList.remove("red-border"); 
}

