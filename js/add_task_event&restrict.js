/**
 * Closes the contact dropdown menu when a click occurs outside of it.
 * Listens for all document-wide clicks and checks whether the click was inside the dropdown or its toggle.
 * If the click was outside, it removes the 'show' and 'back' classes to hide the dropdown.
 *
 * @param {MouseEvent} event - The click event triggered on the document.
 *
 * @var {HTMLElement|null} menu - The dropdown menu element being toggled.
 * @var {HTMLElement|null} toggle - The element that toggles the dropdown visibility (e.g. input or button).
 */
document.addEventListener("click", function (event) {
    const menu = document.getElementById("dropdownMenu");
    const toggle = document.getElementById("toggleDropdown");
  
    if (
      menu &&
      toggle &&
      !menu.contains(event.target) &&
      !toggle.contains(event.target)
    ) {
      menu.classList.remove("show");
      toggle.classList.remove("back"); 
    }
  });

  /**
 * Initializes the minimum date selection for the due date input field.
 * Ensures that only today or future dates are selectable.
 * Also attaches validation logic to reject manually entered past dates.
 *
 * @function
 * @returns {void}
 *
 * @var {HTMLInputElement|null} dateInput - The due date input field, if it exists.
 * @var {string} minDate - Today's date in 'YYYY-MM-DD' format.
 */
  function restrictDueDateToToday() {
    const dateInput = document.getElementById("date-task");
    if (!dateInput) return;
  
    const minDate = getTodayAsMinDate();
    dateInput.setAttribute("min", minDate);
  
    setupDueDateValidation(dateInput);
  }
  
  /**
 * Returns today's date formatted as a minimum date string for HTML date input fields.
 * Format: 'YYYY-MM-DD', padded with zeros as needed.
 *
 * @function
 * @returns {string} Today's date as a string in 'YYYY-MM-DD' format.
 *
 * @var {Date} today - Current system date.
 * @var {string} yyyy - Four-digit year.
 * @var {string} mm - Two-digit month.
 * @var {string} dd - Two-digit day.
 */
  function getTodayAsMinDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  
  /**
 * Attaches input validation to the due date field.
 * Shows a custom error message if the user selects or types a past date.
 *
 * @function
 * @param {HTMLInputElement} input - The due date input element to validate.
 *
 * @var {Date} selectedDate - The date selected or entered by the user.
 * @var {Date} today - Today's date set to midnight for accurate comparison.
 */
  function setupDueDateValidation(input) {
    input.addEventListener("input", () => {
      const selectedDate = new Date(input.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      if (selectedDate < today) {
        input.setCustomValidity("Please select today or a future date.");
        input.reportValidity();
      } else {
        input.setCustomValidity("");
      }
    });
  }
  
  
  /**
 * Adds real-time input validation for required form fields.
 * Attaches 'input' event listeners to defined fields to automatically hide error messages once the user starts typing.
 * Skips any field that does not exist in the DOM.
 *
 * @var {Array<{id: string, errorId: string}>} fields - A list of form field IDs and their associated error message IDs.
 */
  function setupLiveValidation() {
    const fields = [
      { id: "title-task", errorId: "errorMsg-title" },
      { id: "date-task", errorId: "errorMsg-date" },
      { id: "assigned_category", errorId: "errorMsg-category" },
    ];
  
    fields.forEach(({ id, errorId }) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", () => hideError(el, errorId));
      }
    });
  }
  
  /**
 * Checks whether an active or guest user is authenticated in localStorage.
 * If no user is found, redirects to the login page and returns false.
 *
 * @returns {boolean} True if a user or guestUser is authenticated; otherwise false (after redirect).
 *
 * @var {string|null} user - The active user retrieved from localStorage.
 * @var {string|null} guestUser - The guest user retrieved from localStorage.
 */
  function isUserAuthenticated() {
    const user = localStorage.getItem("activeUser");
    const guestUser = localStorage.getItem("guestUser");
  
    if (!user && !guestUser) {
      window.location.href = "log_in.html";
      return false;
    }
    return true;
  }
  
  /**
 * Retrieves the active user from localStorage and renders their initials in the UI.
 * If no user is found, the function exits silently.
 *
 * @var {Object|null} user - The active user object parsed from localStorage.
 */
  function renderActiveUserInitials() {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    const guestUser = localStorage.getItem("guestUser");
    if (user) {
      renderInitials(user);
    } else if (guestUser) {
      document.getElementById('initialNames').innerHTML = "G";
    }
  }
  
  function setDefaultMediumPriority() {
    const mediumBtn = document.querySelector(".priorty_button.medium");
    if (mediumBtn) {
      selectPriority(mediumBtn);
    }
  }
  
  /**
 * Enables the Enter key to add a subtask directly from the input field.
 * Prevents form submission when Enter is pressed and the input is not empty.
 *
 * @var {HTMLInputElement|null} todoInput - The input field for entering subtasks.
 * @event keydown - Triggers subtask creation if the Enter key is pressed.
 */
  function setupSubtaskEnterShortcut() {
    const todoInput = document.getElementById("todoInput");
    if (todoInput) {
      todoInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && todoInput.value.trim() !== "") {
          e.preventDefault();
          addTodo();
        }
      });
    }
  }

  /**
 * Adds an event listener to trigger subtask creation when Enter is pressed.
 * Waits for the DOM to fully load before attaching the listener to the input field.
 * Ensures the input exists to prevent errors on pages where it may be missing.
 *
 * @var {HTMLInputElement|null} todoInput - The input field for subtasks, if present in the DOM.
 * @var {KeyboardEvent} e - The keydown event object used to detect the Enter key.
 */
window.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.getElementById("todoInput");
    if (todoInput) {
      todoInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          addTodo();
        }
      });
    }
  });

  /**
 * Validates the required fields of the task form before saving.
 * Checks that title, due date, and category fields are not empty.
 * Displays or hides error messages accordingly and returns the overall validity.
 *
 * @returns {boolean} True if all required fields are filled, otherwise false.
 *
 * @var {boolean} isValid - Indicates whether the form is valid (default: true).
 * @var {HTMLInputElement} titleField - The input field for the task title.
 * @var {HTMLInputElement} dateField - The input field for the task due date.
 * @var {HTMLSelectElement} categoryField - The dropdown select element for the task category.
 */
function validateTaskBeforeSave() {
    const fields = [
      { id: "title-task",         errorId: "errorMsg-title" },
      { id: "date-task",          errorId: "errorMsg-date" },
      { id: "assigned_category",  errorId: "errorMsg-category" },
    ];
    let isValid = true;
    fields.forEach(({ id, errorId }) => {
      const el = document.getElementById(id);
      if (!el.value.trim()) { showError(el, errorId); isValid = false; }
      else hideError(el, errorId);
    });
    return isValid;
  }
  
  /**
 * Clears all input fields, selections, and visual states in the task form.
 * Resets text inputs, dropdowns, checkboxes, subtasks, and selected contact chips.
 * Prepares the form for a new task entry by restoring the default UI state.
 *
 * @var {HTMLInputElement} title - The input field for the task title.
 * @var {HTMLInputElement} description - The input field for the task description.
 * @var {HTMLInputElement} duedate - The input field for the task due date.
 * @var {HTMLSelectElement} category - The select dropdown for task categories.
 * @var {NodeListOf<HTMLElement>} priorityButtons - All priority button elements.
 * @var {NodeListOf<HTMLInputElement>} checkboxes - All contact selection checkboxes.
 * @var {NodeListOf<HTMLElement>} selectedItems - Contact items visually marked as selected.
 * @var {HTMLElement} selectedContacts - Container where contact chips are displayed.
 * @var {HTMLElement} todoList - The container holding all subtask items.
 * @var {HTMLInputElement} todoInput - The input field for adding new subtasks.
 * @var {HTMLElement|null} mediumBtn - The "medium" priority button to reselect as default.
 */
  function resetForm() {
    document.getElementById("title-task").value = "";
    document.getElementById("description-task").value = "";
    document.getElementById("date-task").value = "";
    document.getElementById("assigned_category").selectedIndex = 0;
    document.querySelectorAll(".priorty_button").forEach((btn) => btn.classList.remove("selected"));
    document.querySelectorAll("#dropdownMenu input[type='checkbox']").forEach((cb) => (cb.checked = false));
    document.querySelectorAll(".contact-item.selected").forEach(item => item.classList.remove("selected"));
    document.getElementById("selectedContacts").innerHTML = "";
    document.getElementById("todoList").innerHTML = "";
    document.getElementById("todoInput").value = "";
    document.querySelectorAll(".error").forEach((el) => {el.classList.remove("error");
    });
    document.querySelectorAll(".input-error").forEach((msg) => {msg.style.display = "none";
    });
    const mediumBtn = document.querySelector(".priorty_button.medium");
    if (mediumBtn) {
      selectPriority(mediumBtn);
    }
    resetFileUpload();
  }