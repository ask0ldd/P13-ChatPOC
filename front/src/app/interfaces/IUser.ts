export interface IUser{
    id : number
    username : string
    email : string
    chatroomName : string
    role : "ADMIN" | "CUSTOMER" | "SUPPORT"
}