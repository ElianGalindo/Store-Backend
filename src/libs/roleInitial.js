import Role from '../models/role.js';

export const createRoles = async () => {
    try {
        const count = await Role.estimatedDocumentCount();
        if(count > 0) return;

        await Promise.all([
            new Role({name: 'admin'}).save(),
            new Role({name: 'moderator'}).save(),
            new Role({name: 'user'}).save()
        ])
    } catch (error) {
        console.error('Something went wrong', error)
    }
}