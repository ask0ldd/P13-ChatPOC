import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/IUser';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  constructor(private httpClient: HttpClient, private authService : AuthService) { }

  get$(){
    return this.httpClient.get<IUser[]>(`api/queue`)
  }

  removeUser$(username : string){
    return this.httpClient.post<IUser[]>('api/queue/remove', username)
  }

  removeSelf$(){
    return this.httpClient.post<IUser[]>('api/queue/remove', this.authService.getLoggedUserName())
  }
}