import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { ILoginResponse } from '../interfaces/ILoginResponse';
import { IUser } from '../interfaces/IUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user : IUser = {
    username: "",
    role: "USER",
    chatroomId: "",
    id: 0,
    email: ""
  }

  private pathService = 'api/auth';

  constructor(private httpClient: HttpClient) { }

  login$(username : String) : Observable<ILoginResponse>{
    return this.httpClient.post<ILoginResponse>(`${this.pathService}/login`, {username : username})
  }

  getLoggedUserName(){
    return this.user.username
  }

  getLoggedUserRole(){
    return this.user.role
  }

  getLoggedUserPrivateRoomId(){
    return this.user.chatroomId
  }

  setLoggedUserName(username : string){
    this.user.username = username
  }

  setLoggedUserRole(role : "USER" | "ADMIN"){
    this.user.role = role
  }

  setLoggedUserPrivateRoomId(roomId : string){
    this.user.chatroomId = roomId
  }

  setLoggedUser(user : IUser){
    this.user = user
  }
}
