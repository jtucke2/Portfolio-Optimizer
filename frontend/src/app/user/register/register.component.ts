import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService, RegisterReturnData } from 'src/app/global/services/auth.service';
import { UserService } from 'src/app/global/services/user.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public errorMessage = '';
  public form: FormGroup = new FormGroup({
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    password_confirm: new FormControl('', Validators.required)
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  public registerSubmit() {
    this.errorMessage = '';
    this.authService.register(this.form.value)
      .subscribe(
        (user: RegisterReturnData) => {
          this.router.navigate(['/home']);
        },
        (err) => {
          this.errorMessage = err.error.message;
        }
      );
  }
}
