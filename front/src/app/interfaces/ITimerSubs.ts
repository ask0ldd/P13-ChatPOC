import { Subscription } from "rxjs"

/*export interface ITimerSubs {
    [chatroomId : string] : Subscription
}*/

export interface ITimerSubs {
    chatroomId : string
    timerSubscription : Subscription
}