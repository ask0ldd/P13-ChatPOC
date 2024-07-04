import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { IUser } from '../interfaces/IUser';
import { BehaviorSubject, Observable, interval, shareReplay, switchMap, tap, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  /*private queueSubject = new BehaviorSubject<IUser[]>([]);
  public queue$ = this.queueSubject.asObservable();*/
  public queue$ = new BehaviorSubject<IUser[]>([]);

  constructor(private httpClient: HttpClient, private authService : AuthService) { }

  startPolling() {
    timer(0, 15000) // Poll every 15 seconds
      .pipe(
        switchMap(() => this.fetchQueue()),
        shareReplay(1)
      ).subscribe({
        next : queue => this.queue$.next(queue),
        error : error => console.error('Error fetching user queue:', error)
      })
  }

  private fetchQueue(): Observable<IUser[]>{
    return this.httpClient.get<IUser[]>(`api/queue`)
  }

  removeUser(username : string){
    this.httpClient.post<IUser[]>('api/queue/remove', {username : username}).subscribe({
      next: (customers) => this.queue$.next(customers),
      error: () => console.log("can't retrieve the queue.")
    })
  }

  removeSelf$(){
    return this.httpClient.post<IUser[]>('api/queue/remove', {username : this.authService.getLoggedUserName()})
  }
  
}
