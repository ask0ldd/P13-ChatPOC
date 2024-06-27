import { IUser } from "./IUser";
import { IChatMessage } from "./IChatMessage";

export interface IChatRoomHistory{
    id : number
    name : string
    user : IUser
    messages : IChatMessage[]
}