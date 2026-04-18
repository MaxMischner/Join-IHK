function getContactListCard(initials, name, email, id, color) {
    return `
            <li class="pointer" id="contact-li-${id}" onclick="clickContactCard('${id}')" contactID="${id}">
                                    <div class="contact-logo" style="background: ${color}">
                                        ${initials}
                                    </div>
                                   
                                    <div class="contact-list-right">
                                        <div class="contact-name">${name}</div>
                                        <div class="contact-email">${email}</div>
                                    </div>
                                </li>
            `;
}

function getContactLetterContainer(letter, allCardHTML) {
    return `<div class="contact-container">
                            <div class="contact-letter">${letter}</div>
                            <div class="contact-underline"></div>
                            <ul>
                                ${allCardHTML}
                            </ul>
                        </div>`;
}

function getContactDetail(initials, name, email, phone, id, color) {
    return `<div class="contact-detail-header flex">
                            <div class="contact-detail-header-logo" style="background:${color}" id="contact-detail-header-logo">
                                ${initials}
                            </div>
                            <div class="contact-detail-header-right">
                                <div class="contact-detail-name" id="contact-detail-name">${name}</div>
                                <div class="flex contact-detail-buttons contact-detail-buttons-onpage">
                                    <button class="flex pointer contact-detail-edit" onclick="editContact(event)">
                                        <span>Edit</span>
                                    </button>
                                    <button class="flex pointer contact-detail-delete" onclick="deleteContact(event)">
                                        
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="contact-detail-info-text">
                            Contact Information
                        </div>
                        <div class="contact-detail-info-title">
                            Email
                        </div>
                        <div class="contact-detail-email" id="contact-detail-email">${email}</div>
                        <div class="contact-detail-info-title">
                            Phone
                        </div>
                        <div class="contact-detail-phone" id="contact-detail-phone">${phone}</div>`;
}

function getEditContact(initals, name, email, phone, color, id) {
    return `<div class="edit-contact-container">
            <img class="edit-contact-container-close pointer close-black" src="asset/images/edit-overlay-close.svg" alt="" onclick="closeContactOverlay(event)"/>
            <img class="edit-contact-container-close pointer close-white" src="asset/images/edit-close-white.png" alt="" style="z-index: 999;"  onclick="closeContactOverlay(event)"/>
            <div class="edit-contact-header flex-column">
                <img src="asset/images/logo-light.svg" alt="" width="50">
                <div class="edit-contact-title">Edit Contact</div>
                <div class="edit-contact-divider"></div>
                <div class="edit-contact-intitals flex" id="edit-contact-intitals" style="background:${color}">
                    <span>${initals}</span>
                    <img class="d-none" src="asset/images/person-white.png" alt="">
                </div>
            </div>
            <div class="edit-contact-right">
                <form onsubmit="saveEditContact(event);return false;" action="">
                    <div class="edit-contact-form flex-column">
                        
                        <div class="edit-contact-field-div">
                            <input class="edit-contact-field" type="text" id="edit-contact-name"  value="${name}" oninput="editChangeName()" onblur="validateContactFieldOnBlur('edit-contact-name','name')" placeholder="Contact name">
                            <img src="./asset/images/person.png" alt="">
                        </div>
                        <div class="edit-contact-field-div">
                            <input class="edit-contact-field" type="text" id="edit-contact-email"  value="${email}"  oninput="clearErrorMsg()" onblur="validateContactFieldOnBlur('edit-contact-email','email')" placeholder="Contact email">
                            <img src="./asset/images/grey-mail.svg" alt="">
                        </div>
                        <div class="edit-contact-field-div">
                            <input class="edit-contact-field" type="text" id="edit-contact-phone"  value="${phone}"  oninput="clearErrorMsg()" onblur="validateContactFieldOnBlur('edit-contact-phone','phone')" placeholder="Contact phone number">
                            <img src="./asset/images/phone.svg" alt="">
                        </div>
                        <div class="edit-contact-error" id="edit-contact-error">The email is already used</div>
                    </div>
                    <div class="edit-contact-bottom">
                        <button class="edit-contact-bottom-delete pointer" type="button" onclick="deleteContact(event)">Delete</button>
                        <button class="edit-contact-bottom-save pointer" type="submit">Save</button>
                    </div>
                </form>
            </div>
            
        </div>`;
}

function getAddContact() {
    return `
    <div class="edit-contact-container">
            <img class="edit-contact-container-close pointer close-black" src="asset/images/edit-overlay-close.svg" alt="" onclick="closeContactOverlay(event)"/>
            <img class="edit-contact-container-close pointer close-white" src="asset/images/edit-close-white.png" alt="" style="z-index: 999;"  onclick="closeContactOverlay(event)"/>
            <div class="edit-contact-header flex-column">
                <img src="asset/images/logo-light.svg" alt="" width="50">
                <div class="edit-contact-title">Add Contact</div>
                <div class="edit-contact-subtitle">Task are better with a team</div>
                <div class="edit-contact-divider"></div>
                <div class="edit-contact-intitals flex" id="edit-contact-intitals" style="background:var(--bg-gray)">
                    <span></span>
                    <img src="asset/images/person-white.png" alt="">
                </div>
            </div>
            <div class="edit-contact-right">
                <form onsubmit="saveEditContact(event);return false;" action="">
                    <div class="edit-contact-form flex-column">
                        
                        <div class="edit-contact-field-div">
                            <input class="edit-contact-field" type="text" id="edit-contact-name"  value="" oninput="editChangeName()" onblur="validateContactFieldOnBlur('edit-contact-name','name')" placeholder="Contact name">
                            <img src="./asset/images/person.png" alt="">
                        </div>
                        <div class="edit-contact-field-div">
                           <input class="edit-contact-field"  type="text" id="edit-contact-email"  value=""  oninput="clearErrorMsg();" onblur="validateContactFieldOnBlur('edit-contact-email','email')" placeholder="Contact email"/>
                            <img src="./asset/images/grey-mail.svg" alt="">
                        </div>
                        <div class="edit-contact-field-div">
                            <input class="edit-contact-field" type="text" id="edit-contact-phone"  value=""  oninput="clearErrorMsg()" onblur="validateContactFieldOnBlur('edit-contact-phone','phone')" placeholder="Contact phone number">
                            <img src="./asset/images/phone.svg" alt="">
                        </div>
                        <div class="edit-contact-error" id="edit-contact-error">The email is already used</div>
                    </div>
                    <div class="edit-contact-bottom">
                        <button class="edit-contact-bottom-clear pointer" type="button" onclick="clearEditContact()">Clear</button>
                        <button class="edit-contact-bottom-save pointer" type="submit" style="width: 85px;">Create</button>
                    </div>
                </form>
            </div>
            
        </div>
    `;
}

function getNotification(text) {

    var elem = document.createElement('div');
    elem.id = "notification-id";
    elem.classList.add("notifaction-btn");
    elem.innerText = text;
    return elem;
}