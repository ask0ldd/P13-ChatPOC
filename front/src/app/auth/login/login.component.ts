import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { ILoginResponse } from 'src/app/interfaces/ILoginResponse';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  errorMessage! : string
  private subscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService : AuthService,
  ) { }

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)])
  })

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.loginForm.valid)
    {
      const username = this.loginForm.get("username")?.value
      if(username) {
        this.authService.login$(username).pipe(take(1)).subscribe({
          next: (user : ILoginResponse) => {
            this.authService.setUsername(user.username)
            this.authService.setUserPrivateRoomId(user.chatroomId)
            this.router.navigate(['/chat'])
          }
        })
      }
    }
  }

  ngOnDestroy(): void {
  }

}
