import { Subscription } from "rxjs"

/*export interface ITimerSubs {
    [chatroomId : string] : Subscription
}*/

export interface IChatTimer {
    chatroomId : string
    timerSubscription : Subscription
}