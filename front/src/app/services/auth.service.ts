import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { ILoginResponse } from '../interfaces/ILoginResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = {
    username : "",
    role : "",
    privateRoomId : "",
  }

  private pathService = 'api/auth';

  constructor(private httpClient: HttpClient) { }

  login$(username : String) : Observable<ILoginResponse>{
    return this.httpClient.post<ILoginResponse>(`${this.pathService}/login`, {username : username})
  }

  getUsername(){
    return this.user.username
  }

  getUserRole(){
    return this.user.role
  }

  getUserPrivateRoomId(){
    return this.user.privateRoomId
  }

  setUsername(username : string){
    this.user.username = username
  }

  setUserRole(role : string){
    this.user.role = role
  }

  setUserPrivateRoomId(roomId : string){
    this.user.privateRoomId = roomId
  }
}
