import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, timer as observableTimer } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { AuthService, RegisterReturnData } from 'src/app/global/services/auth.service';

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
    email: new FormControl('', [Validators.required, Validators.email], this.validateEmail.bind(this)),
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

  private validateEmail(emailCtrl: FormControl): Observable<any> {
    return observableTimer(100).pipe(
      switchMap(() => this.authService.emailTaken(emailCtrl.value)),
      map((emailTaken: boolean) => emailTaken ? { emailTaken: true } : null)
    );
  }
}
