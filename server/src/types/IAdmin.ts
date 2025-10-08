export interface IAdmin {
    id: string,
    username: string,
    refreshToken: string | null
    email: string,
    password: string | null
}