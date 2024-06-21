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
    role : ""
  }

  private pathService = 'api/auth';

  constructor(private httpClient: HttpClient) { }

  login$(username : String) : Observable<ILoginResponse>{
    /*const user$ = this.httpClient.post<ILoginResponse>(`${this.pathService}/login`, {username : username})
    user$.pipe(take(1)).subscribe(data => this.user.username = data.username)
    return user$*/
    return this.httpClient.post<ILoginResponse>(`${this.pathService}/login`, {username : username})
  }

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
