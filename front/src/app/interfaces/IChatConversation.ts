import { IChatMessage } from "./IChatMessage"
import { IUser } from "./IUser"

export interface IChatConversation{
    id : number
    name : string
    owner : IUser
    messages : IChatMessage[]
}