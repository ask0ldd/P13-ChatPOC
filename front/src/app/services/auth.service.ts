import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = {
    username : "",
    role : ""
  }

  constructor() { }

  getUsername(){
    return this.user.username
  }

  getRole(){
    return this.user.role
  }

  setUsername(username : string){
    this.user.username = username
  }

  setUserRole(role : string){
    this.user.role = role
  }

}
