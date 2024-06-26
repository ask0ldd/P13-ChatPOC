import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { ILoginResponse } from '../interfaces/ILoginResponse';
import { IUser } from '../interfaces/IUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedUser : IUser = {
    username: "",
    role: "CUSTOMER",
    chatroomId: "",
    id: 0,
    email: ""
  }

  private pathService = 'api/auth';

  constructor(private httpClient: HttpClient) { }

  login$(username : String) : Observable<ILoginResponse>{
    return this.httpClient.post<ILoginResponse>(`${this.pathService}/login`, {username : username})
  }

  disconnect(){
    return this.httpClient.post(`${this.pathService}/disconnect`, {username : this.loggedUser.username})
  }

  getLoggedUserName(){
    return this.loggedUser.username
  }

  getLoggedUserRole(){
    return this.loggedUser.role
  }

  getLoggedUserPrivateRoomId(){
    return this.loggedUser.chatroomId
  }

  setLoggedUser(user : IUser){
    console.log(user)
    this.loggedUser = user
  }
}
