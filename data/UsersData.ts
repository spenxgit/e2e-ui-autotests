export class User {

    email = '';
    password = '';

    constructor(
        email,
        password
    ) {
        this.email = email;
        this.password = password;
    }
}

export const Users = {
    UserA: new User(
        'autotest@spenxy.com',
        '3XwUJv7KkV',
    ),
}

