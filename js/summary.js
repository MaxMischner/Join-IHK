
let tasks = [];
let toDoTasks = [];
let doneTasks = [];
let urgentTasks = [];
let awaitFeedback = [];
let inProgress = [];
let upcomingDeadline = null;


/**
 * onload init Function.
 * - checks if the user is logged in. if not, the user ist forwarded to the log in site
 * - starts several functions
 * - renders the content when getTasks is done
 */
async function initSummary() {
    let user = localStorage.getItem("activeUser");
    let guestUser = localStorage.getItem("guestUser");
    if (!user && !guestUser) {
        window.location.href = "index.html";
        return ;
    } 
    await getTasks();
    let activeUser = JSON.parse(localStorage.getItem("activeUser"));
    renderName (activeUser);
    renderGreeting();
    renderInitials(activeUser);
    renderMobileGreeting (activeUser);
}

/**
 * Renders a mobile greeting screen based on the device width and user status.
 * 
 * This function checks if the current screen width is less than or equal to 780px,
 * identifying it as a mobile view. If on mobile, it hides the logo,
 * shows the main container, and then conditionally renders either a guest
 * greeting or a personalized user greeting based on the `activeUser` parameter.
 * 
 * If the screen is wider than 780px (i.e., not mobile), the full content view is rendered.
 * 
 * @function renderMobileGreeting
 * @param {string|null} activeUser - The name or ID of the active user. If null or undefined, the guest greeting will be shown.
 * 
 */
function renderMobileGreeting(activeUser) {
    const isMobile = window.innerWidth <= 780;
    if (isMobile) {
        document.getElementById('mainContainer').classList.remove('d-none');
        document.getElementById('waitLogo').classList.add('d-none');
        document.getElementById('summaryContentLeft').classList.add('d-none');
        if (!activeUser) {            
            showGuestGreeting()
        } else {
            showUserGreeting(activeUser)
        }        
    }else {
        renderContent()
    }
}

/**
 * Displays a temporary greeting screen for guest users on mobile devices.
 * 
 * This function reveals the guest greeting element by removing the `d-none` class
 * and calls `renderMobileGreetingGuest()` to populate the greeting content.
 * 
 * After a delay of 2 seconds, the greeting is hidden again and the summary content
 * section is shown.
 * 
 * This function is intended to be used within mobile views only.
 * 
 * @function showGuestGreeting
 */
function showGuestGreeting() {
    document.getElementById('mobileGreetingGuest').classList.remove('d-none');
    renderMobileGreetingGuest();
    setTimeout(() => {
        document.getElementById('mobileGreetingGuest').classList.add('d-none');
        document.getElementById('summaryContentLeft').classList.remove('d-none');
    }, 2000); 
}

/**
 * Displays a personalized greeting for a logged-in user on mobile devices.
 * 
 * This function shows the user greeting screen by removing the `d-none` class from 
 * the mobile greeting element. It then calls `renderMobileGreetingUser()` to set up 
 * the greeting view and inserts the active user's name into the designated element.
 * 
 * After 2 seconds, the greeting screen is hidden and the main summary content is shown.
 * 
 * @async
 * @function showUserGreeting
 * @param {Array} activeUser - An array containing the active user object, where `activeUser[0].name` is used for display.
 */
async function showUserGreeting(activeUser) {
    document.getElementById('mobileGreetingUser').classList.remove('d-none');
    renderMobileGreetingUser();
    document.getElementById('userNameMobile').innerHTML = activeUser[0].name;    
    setTimeout(() => {
        document.getElementById('mobileGreetingUser').classList.add('d-none');
        document.getElementById('summaryContentLeft').classList.remove('d-none');
    }, 2000); 
}


/**
 * Checks the current time and selects the appropriate greeting 
 * for the guest-user depending on the time.
 * 
 */
function renderMobileGreetingGuest() {
    let today = new Date();
    let hour = today.getHours()
    if((hour >=0) && (hour <=9))
        document.getElementById('mobileGreetingGuestGreet').innerHTML = 'Good Morning!'
    if((hour >=10) && (hour <=18))
        document.getElementById('mobileGreetingGuestGreet').innerHTML = 'Good Day!'
    if((hour >=19) && (hour <=23))
        document.getElementById('mobileGreetingGuestGreet').innerHTML = 'Good Evening!'
}

/**
 * Checks the current time and selects the appropriate greeting 
 * for the user depending on the time.
 * 
 */
function renderMobileGreetingUser() {
    let today = new Date();
    let hour = today.getHours()
    if((hour >=0) && (hour <=9))
        document.getElementById('mobileGreetingUserGreet').innerHTML = 'Good Morning,'
    if((hour >=10) && (hour <=18))
        document.getElementById('mobileGreetingUserGreet').innerHTML = 'Good Day,'
    if((hour >=19) && (hour <=23))
        document.getElementById('mobileGreetingUserGreet').innerHTML = 'Good Evening,'
}

/**
 * Renders and shows the content of the site
 * Wait till all data is loaded in the fields an removes display:none
 * from the content and ads it to the logo. 
 *  
 */
function renderContent() {
    document.getElementById('mainContainer').classList.remove('d-none');
    document.getElementById('waitLogo').classList.add('d-none');
}


/**
 * Fetches all task data from the Firebase database and processes it for display on the summary page.
 * 
 * The function retrieves all tasks from the database, extracts their keys, and iterates over each task. 
 * It then calls different render functions to process the task:
 * - `renderTodoDone(task)` checks the task status and updates the number of "To do" and "Done" tasks.
 * - `renderUrgent(task)` checks and updates the count of tasks with high priority.
 * - `renderSummary(task, keys)` updates the general task summary.
 * 
 * Additionally, `renderDeadline()` is called before the loop to display upcoming deadlines.
 *
 * @async
 * @function
 * @returns {Promise<void>} - A promise that resolves after all tasks are fetched and processed.
 */
async function getTasks() {
    const { data, error } = await db.from('tasks').select('*');
    if (error) { console.error('Error fetching tasks:', error); return; }
    const tasks = data || [];
    renderDeadline(tasks);
    tasks.forEach(task => {
        renderTodoDone(task);
        renderUrgent(task);
        renderSummary(task, tasks);
    });
}

/**
 * Renders the amount of tasks with status 'To do' and 'Done'.
 * Checks if the status of the given task is 'To do' or 'Done' and pushes it into 
 * the corresponding arrays `toDoTasks` or `doneTasks`.
 * Then updates the HTML with the current number of tasks in each category.
 * 
 * @param {object} task - A single task object fetched from the database.
 */
function renderTodoDone(task) {
    if (task.status === "To do") {
        toDoTasks.push(task);
        document.getElementById('toDos').innerHTML = toDoTasks.length;
    } else if (task.status === "done") {
        doneTasks.push(task);
        document.getElementById('done').innerHTML = doneTasks.length;
    }
}

/**
 * Renders the amount of tasks with status 'Urgent'.
 * Checks if the status of the given task is 'Urgent' and pushes it into 
 * the corresponding arrays `urgentTasks`.
 * Then updates the HTML with the current number of tasks in each category.
 * 
 * @param {object} task - A single task object fetched from the database.
 */
async function renderUrgent(task) {
    if (task.priority === "Urgent") {
        urgentTasks.push(task)
        document.getElementById('urgent').innerHTML = urgentTasks.length; 
    }
}

/**
 * Fetches all tasks from the database and determines the earliest upcoming deadline.
 * 
 * Iterates through all tasks and checks for valid `duedate` values.
 * The function finds the closest upcoming date and sets it as the global 
 * `upcomingDeadline`.
 * It then formats this date using Moment.js and renders it in the DOM element 
 * with the ID `deadline`.
 * 
 */
function renderDeadline(tasksArray) {
    for (let i = 0; i < tasksArray.length; i++) {
        let task = tasksArray[i];
        if (task.duedate && task.duedate !== 'null') {
            if (upcomingDeadline === null || new Date(task.duedate) < new Date(upcomingDeadline)) {
                upcomingDeadline = task.duedate;
            }
        }
    }
    let deadline = new Date(upcomingDeadline).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
    document.getElementById('deadline').innerHTML = deadline;
}

/**
 * Renders the amount of tasks with status 'in Progress' and 'Done'.
 * checks the amount of all tasks in object keys updates the HTML with the current 
 * number of all tasks.
 * Checks if the status of the given task is 'in Progress' or 'await Feedback' and pushes it into 
 * the corresponding arrays `inProgress` or `awaitFeedback`.
 * Then updates the HTML with the current number of tasks in each category.
 * 
 * @param {object} task - A single task object fetched from the database.
 */
async function renderSummary(task, allTasks) {
    document.getElementById('tasksTotal').innerHTML = allTasks.length;
    if (task.status === "in Progress") {
        inProgress.push(task)
        document.getElementById('tasksInProgress').innerHTML = inProgress.length; 
    }else if (task.status === "await Feedback") { 
        awaitFeedback.push(task);
        document.getElementById('tasksAwaitFeedback').innerHTML = awaitFeedback.length; 
    }
}

/**
 * Checks the current time and selects the appropriate greeting 
 * for the user depending on the time.
 * 
 */
function renderGreeting() {
    let today = new Date();
    let hour = today.getHours()
    if((hour >=0) && (hour <=9))
        document.getElementById('greeting').innerHTML = 'Good Morning'
    if((hour >=10) && (hour <=18))
        document.getElementById('greeting').innerHTML = 'Good Day'
    if((hour >=19) && (hour <=23))
        document.getElementById('greeting').innerHTML = 'Good Evening'
}

/**
 * Checks the looged in user and updates his name in HTML. 
 * 
 * @param {string} activeUser - name of the logged in user
 */
function renderName(activeUser) {
   if (!activeUser) {
        document.getElementById('userName').innerHTML = ""; 
   }else
        document.getElementById('userName').innerHTML = activeUser[0].name; 
}
