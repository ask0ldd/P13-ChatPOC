import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  activeUser = ""

  constructor() { }

  getActiveUser(){
    return this.activeUser
  }

  setActiveUser(username : string){
    this.activeUser = username
  }
}
