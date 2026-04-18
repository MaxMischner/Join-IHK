/**
 * Filters the visible contact list based on the search input value.
 * It compares the lowercase search term with each contact's `data-name` attribute.
 * Matching contacts remain visible, others are hidden from the dropdown.
 *
 * @var {string} input - The lowercase search string entered by the user.
 * @var {NodeListOf<HTMLElement>} items - All contact elements in the dropdown list.
 * @var {string} name - The lowercase name value from each contact's dataset.
 */
function filterContacts() {
    const input = document
      .getElementById("contactSearchInput")
      .value.toLowerCase();
    const items = document.querySelectorAll(".contact-item");
    items.forEach((item) => {
      const name = item.dataset.name.toLowerCase();
      item.style.display = name.includes(input) ? "flex" : "none";
    });
  }

/**
 * Fetches all contacts from the API and transforms them into an array of objects.
 * Each object contains a contact's unique key and associated data.
 * Passes the result to the dropdown rendering function with optional preselected names.
 *
 * @param {string[]} [preSelectedNames=[]] - Optional list of contact names to be preselected in the dropdown.
 *
 * @var {Response} response - The raw fetch response from the contacts endpoint.
 * @var {Object} responseJSON - The parsed JSON response containing all contacts by ID.
 * @var {string[]} keys - The Firebase-generated keys for each contact entry.
 * @var {Array<Object>} allContacts - An array of contact objects in the format { key: contactData }.
 */
  async function getAllContacts(preSelectedNames = []) {
    const { data, error } = await db.from('contacts').select('*');
    if (error) { console.error('Error fetching contacts:', error); return; }
    renderContactsInDropdown(data || [], preSelectedNames);
  }

/**
 * Renders all provided contacts into the dropdown menu.
 * Creates a contact item element for each contact and appends it to the container.
 * Then updates the selected contact chips based on the current checkbox states.
 *
 * @param {Array<Object>} allContacts - Array of contact objects in the format { key: contactData }.
 * @param {string[]} [preSelectedNames=[]] - List of names that should appear as selected.
 *
 * @var {HTMLElement} container - The dropdown container element where contacts are rendered.
 * @var {[string, Object]} key/value - The extracted key-value pair from each contact object.
 * @var {HTMLElement} contactItem - The DOM element representing a single contact entry.
 */
  function renderContactsInDropdown(contacts, preSelectedNames = []) {
    const container = document.getElementById("dropdownContent");
    if (!container) return;

    contacts.forEach((contact) => {
      const contactItem = createContactItem(contact.id, contact, preSelectedNames);
      container.appendChild(contactItem);
    });
    handleSelectionChange();
  }
    
/**
 * Creates a contact item element with name, color, and selection checkbox.
 * Marks the checkbox as selected if the contact is in the preselected names list.
 * Adds a click listener to toggle selection and update the selected chips.
 *
 * @param {string} key - The unique ID or key for the contact.
 * @param {Object} contact - The contact object containing name and color properties.
 * @param {string[]} [preSelectedNames=[]] - Optional list of names to preselect.
 *
 * @var {string} name - The full name of the contact.
 * @var {string} colorItem - The background color associated with the contact.
 * @var {HTMLInputElement} checkbox - The checkbox used to mark the contact as selected.
 * @var {HTMLElement} contactItem - The full contact item element combining name, color, and checkbox.
 *
 * @returns {HTMLElement} The constructed contact item element.
 */
  function createContactItem(key, contact, preSelectedNames = []) {
    const name = contact.name;
    const colorItem = contact.color;
    const checkbox = createContactCheckbox(key, name);
  
    if (preSelectedNames.includes(name)) {
      checkbox.checked = true;
    }
  
    const contactItem = buildContactItem(name, checkbox, colorItem);
    contactItem.addEventListener("click", (event) => {
      if (event.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
        handleSelectionChange();
      }
    });
    return contactItem;
  }
  
/**
 * Builds a contact item element with name initials and a checkbox.
 * Applies the contact's color to the initials circle for visual identity.
 * Returns the complete DOM element for rendering in the dropdown list.
 *
 * @param {string} name - The full name of the contact.
 * @param {HTMLInputElement} checkbox - The checkbox used for selecting the contact.
 * @param {string} colorItem - The background color associated with the contact.
 *
 * @var {string} initials - The extracted initials from the contact name.
 * @var {string} color - The background color applied to the initials element.
 * @var {HTMLDivElement} item - The fully constructed contact item element.
 *
 * @returns {HTMLDivElement} The configured contact DOM element.
 */
    function buildContactItem(name, checkbox, colorItem) {
      const initials = getInitials(name);
      const color = colorItem;
      const item = document.createElement("div");
      item.className = "contact-item";
      item.dataset.name = name;
      item.appendChild(createContactLeft(name, initials, color));
      item.appendChild(createContactRight(checkbox));
      return item;
    }
    
/**
 * Creates a checkbox input element for a contact with its key and name.
 * Attaches a change listener to update the selected contact chips when toggled.
 * Returns the configured checkbox element.
 *
 * @param {string} key - The unique key or ID of the contact.
 * @param {string} name - The display name of the contact (used for selection tracking).
 *
 * @var {HTMLInputElement} checkbox - The configured checkbox element.
 *
 * @returns {HTMLInputElement} The checkbox input element ready for rendering.
 */
    function createContactCheckbox(key, name) {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = key;
      checkbox.dataset.name = name;
      checkbox.classList.add("contact-checkbox");
      checkbox.addEventListener("change", handleSelectionChange);
      return checkbox;
    }
    
/**
 * Creates the left section of a contact item containing initials and name.
 * Displays the initials inside a colored circle using the provided color value.
 * Returns the constructed DOM element for use in the contact item layout.
 *
 * @param {string} name - The full name of the contact.
 * @param {string} initials - The extracted initials to display in the colored circle.
 * @param {string} color - The background color for the initials circle.
 *
 * @var {HTMLDivElement} left - The DOM element containing the initials and name span.
 *
 * @returns {HTMLDivElement} The configured left section of the contact item.
 */
    function createContactLeft(name, initials, color) {
      const left = document.createElement("div");
      left.className = "contact-left";
      left.innerHTML = `<div class="contact-initial" style="background:${color}">${initials}</div>
        <span>${name}</span>`;
  
      return left;
    }
    
/**
 * Creates the right section of a contact item containing the checkbox.
 * Wraps the checkbox in a styled container for consistent layout.
 * Returns the complete DOM element for integration into the contact item.
 *
 * @param {HTMLInputElement} checkbox - The checkbox element to be wrapped.
 *
 * @var {HTMLDivElement} right - The wrapper element for the checkbox.
 *
 * @returns {HTMLDivElement} The configured right section of the contact item.
 */
    function createContactRight(checkbox) {
      const right = document.createElement("div");
      right.className = "contact-checkbox-wrapper";
      right.appendChild(checkbox);
      return right;
    }
    
/**
 * Generates initials from a given full name string.
 * Splits the name by spaces and joins the first character of each word.
 * Returns the initials in uppercase or '??' if input is invalid.
 *
 * @param {string} name - The full name to generate initials from.
 *
 * @returns {string} The generated uppercase initials or '??' if input is invalid.
 */
function getInitials(name) {
  if (!name || typeof name !== "string") return "??";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

  
 /**
 * Updates the list of selected contacts based on checkbox states.
 * Visually highlights selected items and generates contact chips for them.
 * Stores the selected contact names as a comma-separated string in the assigned variable.
 *
 * @var {HTMLInputElement[]} checkboxes - All contact checkboxes currently rendered in the dropdown.
 * @var {HTMLElement} selectedContactsDiv - The container where selected contact chips are rendered.
 * @var {Array<string>} selectedNames - Names of all currently selected contacts.
 * @var {string} name - The contact name from the checkbox's dataset.
 * @var {HTMLElement} contactItem - The wrapper element representing a contact entry.
 * @var {HTMLElement} contactInitial - The element showing the contact's initials and background color.
 * @var {string} bgColor - The computed background color used for the contact chip.
 * @global {string} assigned - Comma-separated list of selected contact names.
 */
  function handleSelectionChange() {
    const checkboxes = getAllContactCheckboxes();
    const selectedContactsDiv = document.getElementById("selectedContacts");
    if (!selectedContactsDiv) return;
  
    const selectedNames = checkboxes
      .filter(cb => cb.checked)
      .map(cb => {
        const name = cb.dataset.name;
        const contactItem = cb.closest(".contact-item");
        contactItem.classList.add("selected");
  
        const contactInitial = contactItem.querySelector(".contact-initial");
        const bgColor = window.getComputedStyle(contactInitial).backgroundColor;
  
        addContactChip(name, selectedContactsDiv, bgColor);
        return name;
      });
  
    checkboxes
      .filter(cb => !cb.checked)
      .forEach(cb => cb.closest(".contact-item").classList.remove("selected"));
  
    assigned = selectedNames.join(", ");
  }
  
    
/**
 * Retrieves all contact checkbox elements from the dropdown content.
 * Selects input elements of type checkbox within the #dropdownContent container.
 * Returns them as an array for easy iteration and filtering.
 *
 * @returns {HTMLInputElement[]} An array of checkbox input elements for all contacts.
 */
    function getAllContactCheckboxes() {
      return Array.from(document.querySelectorAll('#dropdownContent input[type="checkbox"]'));
    }
    
 /**
 * Creates and displays a contact chip with initials and a background color.
 * Uses the contact's name to generate initials and assign a color.
 * Appends the chip element to the specified container.
 *
 * @param {string} name - The full name of the contact.
 * @param {HTMLElement} container - The container element where the chip should be appended.
 * @param {string} color - The background color to apply to the chip.
 *
 * @var {HTMLDivElement} chip - The chip element showing the contact's initials and color.
 */
    function addContactChip(name, container, color) {
        const chip = document.createElement("div");
        chip.className = "selected-contact-chip";
        chip.textContent = getInitials(name);
        chip.style.backgroundColor = color;
        container.appendChild(chip);
      }
      
/**
 * Highlights a form field with an error state and displays the associated error message.
 * Adds the 'error' class to the input field and makes the error message visible.
 * The error message is selected using the provided element ID.
 *
 * @param {HTMLElement} field - The form field element to highlight (e.g. input or select).
 * @param {string} errorId - The ID of the element that displays the error message.
 */
  function showError(field, errorId) {
    field.classList.add("error");
    document.getElementById(errorId).style.visibility = "visible";
  }

/**
 * Removes the error state from a form field and hides the associated error message.
 * Removes the 'error' class from the input field and sets the error message display to none.
 *
 * @param {HTMLElement} field - The form field element to clear from the error state.
 * @param {string} errorId - The ID of the element that displays the error message.
 */
  function hideError(field, errorId) {
    field.classList.remove("error");
    document.getElementById(errorId).style.visibility = "hidden";
  }
  
  /**
 * Sets up click event listeners for all priority buttons.
 * Ensures only one button can be selected at a time by toggling the 'selected' class.
 * Visually indicates the active priority level.
 *
 * @var {NodeListOf<HTMLElement>} priorityButtons - All elements with the class `.priorty_button`.
 */
function setupPriorityButtons() {
  const priorityButtons = document.querySelectorAll(".priorty_button");
  priorityButtons.forEach((btn) => {btn.addEventListener("click", () => {
      priorityButtons.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });
}

/**
 * Activates a selected priority button and updates its icon to the active state.
 * Resets all other priority buttons to their default style and icon using an icon map.
 * Updates the global `priority` variable based on the selected button's data attribute.
 *
 * @param {HTMLElement} button - The clicked priority button element.
 *
 * @var {NodeListOf<HTMLElement>} buttons - All elements with the class `.priorty_button`.
 * @var {Object} iconMap - Mapping of priority levels to their default and active icon sources.
 * @var {string} selectedLevel - The priority level class of the selected button (e.g., "urgent").
 * @var {HTMLImageElement} activeImg - The image element inside the selected button to update the icon.
 * @global {string} priority - Holds the currently selected priority level.
 */


function selectPriority(button) {
  const buttons = document.querySelectorAll(".priorty_button");
  const iconMap = {
    urgent: {
      default: "asset/img/icons/icon_urgent.png",
      active: "asset/img/icons/prio_alta.png",
    },
    medium: {
      default: "asset/img/icons/icon_medium.png",
      active: "asset/img/icons/prio_media.png",
    },
    low: {
      default: "asset/img/icons/icon_low.png",
      active: "asset/img/icons/prio_baja.png",
    },
  };

  buttonReset(buttons, iconMap);
  button.classList.add("selected");
  const selectedLevel = getPriorityLevel(button);
  const activeImg = button.querySelector("img");
  if (selectedLevel) activeImg.src = iconMap[selectedLevel].active;
  priority = button.dataset.value;
}

/**
 * Gathers task data from the form and sends it to the backend for saving.
 * Uses putTask to store the task in the database, then resets the form.
 * Redirects the user to the board view after saving is complete.
 *
 * @var {Object} data - The compiled task object containing all relevant task fields.
 * @var {string} data.title - The task title.
 * @var {string} data.description - The task description.
 * @var {string} data.assigned - A comma-separated list of assigned contact names.
 * @var {string} data.category - The selected task category.
 * @var {string} data.duedate - The due date of the task (YYYY-MM-DD).
 * @var {string} data.priority - The selected priority level.
 * @var {string} data.status - The task status (e.g. "todo", "in-progress", etc.).
 * @var {Array<{name: string, completed: boolean}>} data.subtasks - Array of subtask objects.
 */
async function saveTask() {
  collectTaskData();
  let data = {
    title, description, assigned, category, duedate, priority, status, subtasks,
    attachments: collectAttachments(),
  };
  await putTask(data);
  resetForm();
  resetFileUpload();
  showTaskToast('Task added to board');
  setTimeout(() => { window.location.href = "board.html"; }, 1200);
}

/**
 * Shows a brief toast notification on the page, then removes it automatically.
 * @param {string} message - The text to display in the toast.
 */
function showTaskToast(message) {
  const toast = document.createElement('div');
  toast.className = 'notifaction-btn';
  toast.innerText = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1500);
}

  

