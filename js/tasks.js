// task priority : Urgent Medium Low
// task category : Technical Task, Administration Task, User Story
// task statuses : To do, In progress, Await feedback, Done

/**
 * To fetch all tasks from DB
 */
async function getAllTasks() {
    const { data, error } = await db.from('tasks').select('*');
    if (error) { console.error('Error fetching tasks:', error); return []; }
    return data || [];
}

/**
 * @param {String} id id is only to be passed by updating task info.
 * @param {object} data {title, description, assigned, category, duedate, priority, status, subtasks}
 */
async function putTask(data, id = "") {
    if (id) {
        const { data: result, error } = await db.from('tasks').update(data).eq('id', id).select().single();
        if (error) { console.error(error); return null; }
        return result;
    } else {
        const { data: result, error } = await db.from('tasks').insert(data).select().single();
        if (error) { console.error(error); return null; }
        console.log("Response:", result);
        return result;
    }
}

async function deleteTask(id) {
    const { error } = await db.from('tasks').delete().eq('id', id);
    if (error) console.error(error);
}
