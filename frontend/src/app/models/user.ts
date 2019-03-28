export enum UserRoles {
    STANDARD_USER = 'STANDARD_USER',
    ADMIN = 'ADMIN'
}

export interface User {
    first_name: string;
    last_name: string;
    email: string;
    role: UserRoles;
    approved: boolean;
    user_id: string;
}
