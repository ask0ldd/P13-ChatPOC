import { IUser } from "./IUser";
import { IChatMessage } from "./IChatMessage";

export interface IChatRoomHistory{
    id : number
    chatroomName : string
    owner : IUser
    messages : IChatMessage[]
}