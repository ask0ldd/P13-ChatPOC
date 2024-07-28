import { StompSubscription } from "@stomp/stompjs"
import { IChatMessage } from "./IChatMessage"

// unused atm
export interface IChatConversation{
    chatroomId : number
    // name : string
    owner : string // IUser
    messages : IChatMessage[]
    sub : StompSubscription[]
}