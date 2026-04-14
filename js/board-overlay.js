/**
 * Closes the overlay and reloads the task list.
 */
async function closeOverlay() {
    let overlayRef = document.getElementById('overlayDetail');
    let overlayDetail = document.getElementById('taskDetail');
    overlayDetail.classList.remove('slide-in');
    overlayDetail.classList.add('slide-out');
    setTimeout(() => {
        overlayRef.classList.add('d-none');
    }, 300);
    subtaskContent = [];
    allTasks = [];
    await getAllTasks();
    renderTasks();
}

/**
 * Closes the add-task-overlay.
 */
function closeAddTaskOverlay() {
    let overlayAddTaskRef = document.getElementById('overlayAddTask');
    let addTaskOverlay = document.getElementById('addTaskOverlay');
    addTaskOverlay.classList.remove('slide-in');
    addTaskOverlay.classList.add('slide-out');
    overlayAddTaskRef.classList.add('d-none');
}

/**
 * Closes the sign out overlay in the header.
 */
function closeSignOutOverlay() {
    let overlaySignOut = document.getElementById('overlay');
    initialNamesDiv.style.background = ""
    initialNamesDiv.style.color = "rgba(41, 171, 226, 1)";
    overlaySignOut.classList.add('d-none');
}

/**
 * Closes the move overlay on mobile.
 */
function closeMoveToOverlay(event) {
    document.getElementById(currentButton).classList.add('d-none');
    document.getElementById('overlayMoveToMobile').classList.add('d-none');
}

/**
 * Renders the task detail overlay.
 */
function renderTaskDetail(index) {
    currentTaskIndex = index;
    let overlay = document.getElementById('overlayDetail');
    let names = allTasks[index].assigned.split(',');
    let subtasksClass = (!allTasks[index].subtasks) ? 'd-none' : '';
    parseSubtasks(index);
    overlay.innerHTML = showTaskDetail(index, names, subtasksClass);
    overlay.classList.remove('d-none');
}

/**
 * Parses the subtasks of a task into subtaskContent.
 */
function parseSubtasks(index) {
    subtaskContent = [];
    let subtasks = allTasks[index].subtasks;
    if (!subtasks) return;
    for (let i = 0; i < subtasks.length; i++) {
        subtaskContent.push({
            name: subtasks[i].name,
            completed: subtasks[i].completed
        });
    }
}

/**
 * Converts due date format for the task detail view.
 */
function taskDetailDueDate(date) {
    let dueDate = moment(date).format('L');
    return dueDate;
}

/**
 * Returns 'on' or 'off' based on subtask completion state.
 */
function getSubTaskImage(index) {
    let subTaskImage = (subtaskContent[index].completed === true ? 'on' : 'off');
    return subTaskImage;
}

/**
 * Toggles the completion state of a subtask in the local array and re-renders.
 */
function changeSubtaskComplete(index, i) {
    let subtask = allTasks[index].subtasks[i];
    subtask.completed = !subtask.completed;
    renderSubtaskOverlay(index);
}

/**
 * Re-renders the subtask section of the overlay.
 */
function renderSubtaskOverlay(index) {
    let subtasks = document.getElementById('subTasksOverlay');
    let currentSubtasks = allTasks[index].subtasks;
    let subtasksClass = (!currentSubtasks || currentSubtasks.length === 0) ? 'd-none' : '';
    subtasks.innerHTML = showOverlaySubtasks(index, subtasksClass);
}

/**
 * Toggles a subtask's completion state in Supabase.
 */
async function changeSubtaskCompleteApi(index, i) {
    let taskId = allTasks[index].id;
    let { data, error } = await db.from('tasks').select('subtasks').eq('id', taskId).single();
    if (error) { console.error(error); return; }
    let subtasks = data.subtasks || [];
    subtasks[i].completed = !subtasks[i].completed;
    await db.from('tasks').update({ subtasks }).eq('id', taskId);
}

/**
 * Opens the delete confirmation overlay.
 */
function deleteTask(index) {
    let test = document.getElementById('overlayDelete');
    test.classList.remove('d-none');
    test.innerHTML = showDeleteTask(index);
}

/**
 * Closes the delete confirmation overlay.
 */
function noDelete() {
    let overlayRef = document.getElementById('overlayDelete');
    document.getElementById('CompletelyDeleteTask').classList.add('d-none');
    overlayRef.classList.add('d-none');
}

/**
 * Deletes the task from Supabase and re-renders the board.
 */
async function deleteTaskCompletely(index) {
    document.getElementById('overlayDelete').classList.add('d-none');
    let taskId = allTasks[index].id;
    await db.from('tasks').delete().eq('id', taskId);
    allTasks.splice(index, 1);
    closeOverlay();
    renderTasks();
}

/**
 * Opens the add-task overlay or redirects to add_task.html on mobile.
 */
function renderAddTaskOverlay() {
    const isMobile = window.innerWidth <= 1200;
    if (isMobile) {
        window.location.href = `add_task.html`;
    } else {
        let overlay = document.getElementById('overlayAddTask');
        overlay.innerHTML = showAddTaskOverlay();
        overlay.classList.remove('d-none');
        getAllContacts();
    }
}

/**
 * Filters tasks based on search input.
 */
function filterTasks() {
    const searchInput = document.getElementById("boardSearchField").value;
    if (searchInput === "") {
        allTasks = [];
        init();
        return;
    }
    if(searchInput.length < 3) return;
    const searchResults = allTasks.filter(result => {
        return result.title.toLowerCase().includes(searchInput.toLowerCase()) || result.description.toLowerCase().includes(searchInput.toLowerCase());
    });
    allTasks = searchResults;
    renderTasks();
}

/**
 * Filters tasks when the search button is clicked.
 */
function filterTasksButton() {
    const searchInput = document.getElementById("boardSearchField").value;
    if (searchInput == "") {
        allTasks = [];
        init();
    } else {
        const searchResults = allTasks.filter(result => {
            return result.title.toLowerCase().includes(searchInput.toLowerCase()) || result.description.toLowerCase().includes(searchInput.toLowerCase());
        });
        allTasks = searchResults;
        renderTasks();
    }
}

/**
 * Renders the Edit Task overlay pre-filled with task data.
 */
function renderEditTaskOverlay(index) {
    const task = allTasks[index];
    let overlay = document.getElementById('overlayAddTask');
    overlay.innerHTML = showEditTaskOverlay(task, index);
    overlay.classList.remove('d-none');
    const preSelectedNames = task.assigned.split(",").map(name => name.trim());
    getAllContacts(preSelectedNames);
    if (task.subtasks && task.subtasks.length > 0) {
        const todoList = document.getElementById("todoList");
        task.subtasks.forEach((subtask) => {
            const item = document.createElement("div");
            item.className = "subtask-list-item";
            item.textContent = subtask.name;
            item.dataset.completed = subtask.completed;
            item.dataset.name = subtask.name;
            item.addEventListener("click", () => editSubtask(item, subtask.name));
            todoList.appendChild(item);
        });
    }
}

/**
 * Saves the edited task to Supabase and refreshes the UI.
 */
async function saveEditedTask(index) {
    collectTaskData();
    const task = allTasks[index];
    const taskId = task.id;
    let updatedData = {
        title,
        description,
        assigned,
        category,
        duedate,
        priority,
        status: task.status,
        subtasks,
    };
    await db.from('tasks').update(updatedData).eq('id', taskId);
    closeAddTaskOverlay();
    allTasks = [];
    await getAllTasks();
    renderTasks();
    renderTaskDetail(index);
}

/**
 * Returns the count of additional assigned users beyond the first four.
 */
function renderAdditionalAssigned(names) {
    const validNames = names.filter(name => isNameInContacts(name));
    const additionalCount = validNames.length - 4;
    return additionalCount > 0 ? additionalCount : '';
}

/**
 * Checks if a name exists in the contacts list.
 */
function isNameInContacts(name) {
    if (!name) return false;
    let nameToFind = name.trim().replace(/\u200B/g, '').toLowerCase();
    return allContactsBoard.some(c =>
        c.name.trim().replace(/\u200B/g, '').toLowerCase() === nameToFind
    );
}
