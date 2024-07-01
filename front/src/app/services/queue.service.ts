import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { IUser } from '../interfaces/IUser';
import { shareReplay, switchMap, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  constructor(private httpClient: HttpClient, private authService : AuthService) { }

  getAutoRefresh$(refreshRate_seconds : number){
    // The timer(0, 60000) creates an observable that emits immediately (0) and then every 60 seconds
    return timer(0, refreshRate_seconds * 1000).pipe(
      // The switchMap operator is used to switch to a new observable (the HTTP request) every time the timer emits
      switchMap(() => this.httpClient.get<IUser[]>(`api/queue`)),
      // shareReplay(1) operator is used to share the latest emitted value with all subscribers 
      // ensuring that if multiple components subscribe to this observable, only one HTTP request is made
      shareReplay(1)
    )
  }

  removeUser$(username : string){
    return this.httpClient.post<IUser[]>('api/queue/remove', {username : username})
  }

  removeSelf$(){
    return this.httpClient.post<IUser[]>('api/queue/remove', {username : this.authService.getLoggedUserName()})
  }
  
}
