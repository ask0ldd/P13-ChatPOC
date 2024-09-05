import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    private router: Router,
    private authService : AuthService,
  ) { }

  loginForm = new FormGroup({
    username: new FormControl('admin', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('password', [Validators.required, Validators.minLength(3)])
  })

  ngOnInit(): void {
  }

  /**
   * Handles the form submission for user login.
   * Validates the form and calls the authentication service to log in the user.
   * 
   * @method
   */
  onSubmit(){
    if(this.loginForm.valid)
    {
      const username = this.loginForm.get("username")?.value
      if(username) {
        this.subscription = this.authService.login$(username).pipe(take(1)).subscribe({
          next: (user : ILoginResponse) => {
            this.authService.setLoggedUser(user)
            this.router.navigate(['/chat'])
          }
        })
      }
    }
  }

  ngOnDestroy(): void {
    if(this.subscription) this.subscription.unsubscribe()
  }

}
