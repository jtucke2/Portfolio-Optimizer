import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService, LoginReturnData } from 'src/app/global/services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });
  public errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  public loginSubmit() {
    console.log(this.form.value);
    this.authService.login(this.form.value)
      .subscribe(
        (dat: LoginReturnData) => {
          this.router.navigate(['/home']);
        },
        (err) => {
          this.errorMessage = err.error.message;
        }
      );
  }

}
