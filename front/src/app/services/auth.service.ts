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

  /**
   * Logs in a user with the given username.
   * @param {String} username - The username of the user to log in.
   * @returns {Observable<ILoginResponse>} An observable of the login response.
   */
  login$(username : String) : Observable<ILoginResponse>{
    return this.httpClient.post<ILoginResponse>(`${this.pathService}/login`, {username : username})
  }

  /**
   * Disconnects the currently logged-in user.
   */
  disconnect(): void{
    this.httpClient.post(`${this.pathService}/disconnect`, {username : this.loggedUser.username}).subscribe()
  }

  /**
   * Gets the username of the currently logged-in user.
   * @returns {string} The username of the logged-in user.
   */
  getLoggedUserName(){
    return this.loggedUser.username
  }

  /**
   * Gets the role of the currently logged-in user.
   * @returns {string} The role of the logged-in user.
   */
  getLoggedUserRole(){
    return this.loggedUser.role
  }

  /**
   * Gets the private chatroom ID of the currently logged-in user.
   * @returns {string} The private chatroom ID of the logged-in user.
   */
  getLoggedUserPrivateRoomId(){
    return this.loggedUser.chatroomId
  }

  /**
   * Sets the logged-in user.
   * @param {IUser} user - The user object to set as the logged-in user.
   */
  setLoggedUser(user : IUser){
    console.log(user)
    this.loggedUser = user
  }
}
