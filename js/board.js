let allTasks = [];
let allContactsBoard = [];
let subtaskContent = [];
let currentDraggedElement;
let currentButton;


async function init() {
    let user = localStorage.getItem("activeUser");
    let guestUser = localStorage.getItem("guestUser");
    if (!user && !guestUser) {
        window.location.href = "log_in.html";
        return;
    }
    let activeUser = JSON.parse(localStorage.getItem("activeUser"));
    renderInitials(activeUser);
    await getAllTasks();
    await getAllContactsBoard();
    await renderTasks();
}

/**
 * Renders the initials of the active user into the DOM.
 */
function renderInitials(activeUser) {
    if (!activeUser) {
        document.getElementById('initialNames').innerHTML = "G";
    } else {
        let originalName = activeUser[0].name;
        let initials = originalName.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase();
        document.getElementById('initialNames').innerHTML = initials;
    }
}

/**
 * Fetches all tasks from Supabase and stores them in allTasks.
 */
async function getAllTasks() {
    const { data, error } = await db.from('tasks').select('*');
    if (error) { console.error('Error fetching tasks:', error); return; }
    allTasks = data || [];
}

/**
 * Fetches all contacts from Supabase and stores them in allContactsBoard.
 */
async function getAllContactsBoard() {
    const { data, error } = await db.from('contacts').select('*');
    if (error) { console.error('Error fetching contacts:', error); return; }
    allContactsBoard = data || [];
}

/**
 * Returns the background color assigned to a contact by name.
 */
function getBackgroundColorNames(name) {
    let nameToFind = name.trim().replace(/\u200B/g, '').toLowerCase();
    let contact = allContactsBoard.find(c =>
        c.name.trim().replace(/\u200B/g, '').toLowerCase() === nameToFind
    );
    return contact ? contact.color : 'null';
}

/**
 * Renders all tasks into the four board columns.
 */
async function renderTasks() {
    document.getElementById('inProgress').innerHTML = "";
    document.getElementById('ToDo').innerHTML = "";
    document.getElementById('await').innerHTML = "";
    document.getElementById('done').innerHTML = "";
    showNoTasksContainer();
    for (let index = 0; index < allTasks.length; index++) {
        renderProgress(index);
        renderTodo(index);
        renderAwaitFeedback(index);
        renderDone(index);
    }
}

/**
 * Removes display:none from the No-Tasks-Container.
 */
function showNoTasksContainer() {
    document.getElementById('noTasksToDo').classList.remove('d-none');
    document.getElementById('noTasksInProgress').classList.remove('d-none');
    document.getElementById('noTasksAwaitFeedback').classList.remove('d-none');
    document.getElementById('noTasksDone').classList.remove('d-none');
}

function renderTodo(index) {
    let ToDo = document.getElementById('ToDo');
    let subtasksClass = (!allTasks[index].subtasks) ? 'd-none' : '';
    let names = allTasks[index].assigned.split(',');
    if (allTasks[index].status === "To do") {
        ToDo.innerHTML += showToDoTasks(index, subtasksClass, names);
        document.getElementById('noTasksToDo').classList.add('d-none');
    }
}

function renderProgress(index) {
    let inProgress = document.getElementById('inProgress');
    let subtasksClass = (!allTasks[index].subtasks) ? 'd-none' : '';
    let names = allTasks[index].assigned.split(',');
    if (allTasks[index].status === "in Progress") {
        inProgress.innerHTML += showInProgressTasks(index, subtasksClass, names);
        document.getElementById('noTasksInProgress').classList.add('d-none');
    }
}

function renderAwaitFeedback(index) {
    let awaitEl = document.getElementById('await');
    let subtasksClass = (!allTasks[index].subtasks) ? 'd-none' : '';
    let names = allTasks[index].assigned.split(',');
    if (allTasks[index].status === "await Feedback") {
        awaitEl.innerHTML += showAwaitFeedbackTasks(index, subtasksClass, names);
        document.getElementById('noTasksAwaitFeedback').classList.add('d-none');
    }
}

function renderDone(index) {
    let done = document.getElementById('done');
    let subtasksClass = (!allTasks[index].subtasks) ? 'd-none' : '';
    let names = allTasks[index].assigned.split(',');
    if (allTasks[index].status === "done") {
        done.innerHTML += showDoneTasks(index, subtasksClass, names);
        document.getElementById('noTasksDone').classList.add('d-none');
    }
}

/**
 * Returns the category CSS class for a task.
 */
function getCategoryClass(index) {
    let category = allTasks[index].category;
    let categoryName = category.split(' ')[0];
    return categoryName.toLowerCase();
}

/**
 * Returns the number of subtasks for a task.
 */
function subTaskLenght(index) {
    if (allTasks[index].subtasks) {
        subTaskLength = allTasks[index].subtasks.length;
    } else {
        subTaskLength = "";
    }
    return subTaskLength;
}

function noBubbling(event) {
    event.stopPropagation();
}

/**
 * Creates initials from a name string.
 */
function getInitials(names) {
    let initials = names.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase();
    return initials;
}

function startDragging(index) {
    if (window.innerWidth <= 1330) return;
    currentDraggedElement = index;
    document.getElementById(`task-card-${index}`).classList.add('tilt-on-drag');
    document.body.classList.add('drag-active');
}

function allowDrop(ev) {
    if (window.innerWidth <= 1330) return;
    ev.preventDefault();
}

/**
 * Updates the task status after drag & drop and saves to Supabase.
 */
async function moveTo(status) {
    let task = allTasks[currentDraggedElement];
    task.status = status;
    renderTasks();
    document.body.classList.remove('drag-active');
    await db.from('tasks').update({ status }).eq('id', task.id);
}

/**
 * Opens the task move overlay on mobile.
 */
function openMoveTaskOverlay(buttonID, event) {
    event.stopPropagation();
    currentButton = buttonID;
    document.getElementById(currentButton).classList.remove('d-none');
    document.getElementById('overlayMoveToMobile').classList.remove('d-none');
}

/**
 * Moves a task to a new status on mobile and saves to Supabase.
 */
async function moveToMobile(overlayMoveTo, index, status, event) {
    event.stopPropagation();
    let task = allTasks[index];
    document.getElementById(overlayMoveTo).classList.add('d-none');
    document.getElementById('overlayMoveToMobile').classList.add('d-none');
    task.status = status;
    renderTasks();
    await db.from('tasks').update({ status }).eq('id', task.id);
}

/**
 * Returns the number of completed subtasks for a task.
 */
function getDoneSubtasks(index) {
    let subTasks = allTasks[index].subtasks;
    if (!subTasks) return;
    let doneSubtasks = subTasks.filter(subtask => subtask.completed === true);
    return doneSubtasks.length;
}
