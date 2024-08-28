import { Subscription } from "rxjs"

export interface IChatTimer {
    chatroomId : string
    timerSubscription : Subscription
}