let title = "";
let description = "";
let assigned = "";
let category = "";
let duedate = "";
let priority = "";
let status = "To do";
let subtasks = "";


/**
 * Initializes the add task view.
 */
function addTaskInit() {
  if (!isUserAuthenticated()) return;

  getAllContacts();
  setupPriorityButtons();
  restrictDueDateToToday();
  setupLiveValidation();
  renderActiveUserInitials();
  setDefaultMediumPriority();
  setupSubtaskEnterShortcut();
}

/**
 * Returns the priority level of a button based on its CSS class.
 */
function getPriorityLevel(button) {
  if (button.classList.contains("urgent")) return "urgent";
  if (button.classList.contains("medium")) return "medium";
  if (button.classList.contains("low")) return "low";
  return null;
}

/**
 * Resets all priority buttons to their default visual state.
 */
function buttenReset(buttons, iconMap) {
  buttons.forEach((btn) => {
    btn.classList.remove("selected");
    const img = btn.querySelector("img");
    const level = getPriorityLevel(btn);
    if (level) img.src = iconMap[level].default;
  });
}

/**
 * Toggles the visibility of the contact dropdown menu.
 */
function toggleDropdown() {
  const menu = document.getElementById("dropdownMenu");
  const toggle = document.getElementById("toggleDropdown");

  if (menu) {
    menu.classList.toggle("show");
  }

  if (toggle) {
    toggle.classList.toggle("back");
  }
}

/**
 * Adds a new subtask item to the task's subtask list.
 */
function addTodo() {
  const input = document.getElementById("todoInput");
  const value = input.value.trim();
  if (value !== "") {
    const todoList = document.getElementById("todoList");
    const item = document.createElement("div");
    item.className = "subtask-list-item";
    item.textContent = value;
    item.dataset.completed = "false";
    item.dataset.name = value;
    item.addEventListener("click", () => editSubtask(item, value));
    todoList.appendChild(item);
    input.value = "";
    toggleSubtaskIcons();
  }
}

/**
 * Creates an image-based button element.
 */
function createIconButton(src, title, onClick) {
  const btn = document.createElement("img");
  btn.src = src;
  btn.title = title;
  btn.onclick = onClick;
  btn.style.cursor = "pointer";
  return btn;
}

/**
 * Creates a new div element with the specified CSS class.
 */
function createWrapper(className) {
  const wrapper = document.createElement("div");
  wrapper.className = className;
  return wrapper;
}

/**
 * Replaces a subtask item with an editable input form.
 */
function editSubtask(item, oldValue) {
  const wrapper = createWrapper("editable-subtask");
  const input = createSubtaskInput(oldValue);
  const delBtn = createDeleteButton(item);
  const saveBtn = createSaveButton(item, input);
  const divider = createDivider();
  wrapper.append(input, delBtn, divider, saveBtn);
  replaceSubtaskContent(item, wrapper);
  input.focus();
}

/**
 * Creates a text input element prefilled with the given value.
 */
function createSubtaskInput(value) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = value;
  return input;
}

/**
 * Creates a delete icon button for a subtask.
 */
function createDeleteButton(item) {
  return createIconButton("asset/img/icons/delete.png", "Delete", () => {
    item.remove();
  });
}

/**
 * Creates a save icon button for confirming subtask edits.
 */
function createSaveButton(item, input) {
  return createIconButton("asset/img/icons/Subtasks icons11.png", "Save", () => {
    const newValue = input.value.trim();
    if (!newValue) return item.remove();
    const newItem = createNewSubtaskItem(newValue);
    item.replaceWith(newItem);
  });
}

/**
 * Builds a new subtask element.
 */
function createNewSubtaskItem(value) {
  const newItem = document.createElement("div");
  newItem.className = "subtask-list-item";
  newItem.textContent = value;
  newItem.addEventListener("click", () => editSubtask(newItem, value));
  return newItem;
}

/**
 * Creates a visual divider element.
 */
function createDivider() {
  const divider = document.createElement("div");
  divider.className = "subtask-divider";
  return divider;
}

/**
 * Clears and replaces the contents of a subtask item.
 */
function replaceSubtaskContent(item, wrapper) {
  item.innerHTML = "";
  item.className = "";
  item.appendChild(wrapper);
}

/**
 * Toggles visibility of subtask action icons based on input content.
 */
function toggleSubtaskIcons() {
  const input = document.getElementById("todoInput");
  const plusBtn = document.getElementById("subtaskPlus");
  const iconGroup = document.getElementById("subtaskConfirmIcons");
  if (input.value.trim() !== "") {
    plusBtn.style.display = "none";
    iconGroup.style.opacity = "1";
    iconGroup.style.pointerEvents = "all";
  } else {
    plusBtn.style.display = "inline";
    iconGroup.style.opacity = "0";
    iconGroup.style.pointerEvents = "none";
  }
}

/**
 * Clears the subtask input field and updates icons.
 */
function clearSubtaskInput() {
  const input = document.getElementById("todoInput");
  input.value = "";
  toggleSubtaskIcons();
}

/**
 * Collects all task-related data from form fields into global variables.
 */
function collectTaskData() {
  title = document.getElementById("title-task").value;
  description = document.getElementById("description-task").value;
  duedate = document.getElementById("date-task").value;
  const selectedPriorityBtn = document.querySelector(".priorty_button.selected");
  priority = selectedPriorityBtn ? selectedPriorityBtn.textContent.trim() : "";
  category = document.getElementById("assigned_category").value;
  const subtaskElements = document.querySelectorAll(".subtask-list-item");
  subtasks = Array.from(subtaskElements).map((el) => {
    return {
      name: el.dataset.name || el.textContent.trim(),
      completed: el.dataset.completed === "true"
    };
  });
}

/**
 * Fetches all tasks from Supabase.
 */
async function getAllTasks() {
  const { data, error } = await db.from('tasks').select('*');
  if (error) { console.error(error); return []; }
  return data || [];
}

/**
 * Saves a new task to Supabase.
 */
async function putTask(data, id = "") {
  const { data: result, error } = await db.from('tasks').insert(data).select().single();
  if (error) { console.error(error); return null; }
  console.log("Response:", result);
  return result;
}
