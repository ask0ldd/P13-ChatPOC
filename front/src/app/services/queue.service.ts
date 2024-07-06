import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { IUser } from '../interfaces/IUser';
import { BehaviorSubject, Observable, interval, shareReplay, switchMap, tap, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  public queue$ = new BehaviorSubject<IUser[]>([]);

  /**
   * @constructor
   * @param {HttpClient} httpClient - The HTTP client for making API requests.
   * @param {AuthService} authService - The authentication service for user-related operations.
   */
  constructor(private httpClient: HttpClient, private authService : AuthService) { }

  /**
   * @public
   * @method startPolling
   * @description Starts polling the queue every 15 seconds and updates the queue$ BehaviorSubject.
   * @returns {void}
   */
  startPolling() : void {
    timer(0, 15000) // Poll every 15 seconds
      .pipe(
        switchMap(() => this.fetchQueue()),
        shareReplay(1)
      ).subscribe({
        next : queue => this.queue$.next(queue),
        error : error => console.error('Error fetching the users queue :', error)
      })
  }

  /**
   * @private
   * @method fetchQueue
   * @description Fetches the current queue from the API.
   * @returns {Observable<IUser[]>} An observable of the user queue.
   */
  private fetchQueue() : Observable<IUser[]>{
    return this.httpClient.get<IUser[]>(`api/queue`)
  }

  /**
   * @public
   * @method removeUser
   * @description Removes a user from the queue by their username.
   * @param {string} username - The username of the user to remove.
   * @returns {void}
   */
  removeUser(username : string) : void{
    this.httpClient.post<IUser[]>('api/queue/remove', {username : username}).subscribe({
      next: (customers) => this.queue$.next(customers),
      error: () => console.log("Can't retrieve the queue.")
    })
  }

  /**
   * @public
   * @method removeSelf$
   * @description Removes the currently logged-in user from the queue.
   * @returns {Observable<IUser[]>} An observable of the updated user queue.
   */
  removeSelf$() : Observable<IUser[]>{
    return this.httpClient.post<IUser[]>('api/queue/remove', {username : this.authService.getLoggedUserName()})
  }
  
}
