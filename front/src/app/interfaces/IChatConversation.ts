import { StompSubscription } from "@stomp/stompjs"
import { IChatMessage } from "./IChatMessage"
export interface IChatConversation{
    chatroomId : number
    owner : string // IUser
    messages : IChatMessage[]
    sub : StompSubscription[]
}