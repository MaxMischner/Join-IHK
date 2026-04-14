
/**
 * To fetch all users from DB
 */
async function getAllUsers() {
    const { data, error } = await db.from('users').select('*');
    if (error) { console.error('Error fetching users:', error); return []; }
    return data || [];
}

/**
 * @param {String} id id is only to be passed by updating user info.
 * @param {object} data {email:"xin33@gmail.com", name:"Yang Xin", password:"1234567"}
 */
async function putUser(data, id = "") {
    if (id) {
        const { data: result, error } = await db.from('users').update(data).eq('id', id).select().single();
        if (error) { console.error(error); return null; }
        return result;
    } else {
        const { data: existing } = await db.from('users').select('id').eq('email', data.email);
        if (existing && existing.length > 0) {
            console.log("User already exists");
            return null;
        }
        const { data: result, error } = await db.from('users').insert(data).select().single();
        if (error) { console.error(error); return null; }
        return result;
    }
}
