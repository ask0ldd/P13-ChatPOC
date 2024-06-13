import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chatfront';

  errorMessage! : string
  private subscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService : AuthService,
  ) { }

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.loginForm.valid)
    {
      const username = this.loginForm.get("username")?.value
      if(username && username != "") this.authService.setActiveUser(username)
    }
    console.log(this.authService.getActiveUser())
    this.router.navigate(['/chat'])
  }

  ngOnDestroy(): void {
  }
}
