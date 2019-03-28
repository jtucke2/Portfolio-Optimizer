import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCardModule, MatToolbarModule } from '@angular/material';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { NavComponent } from './components/nav/nav.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth.guard';

@NgModule({
  declarations: [
    LandingPageComponent,
    NavComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    RouterModule,
    HttpClientModule
  ],
  exports: [
    LandingPageComponent,
    NavComponent
  ],
  providers: [
    ApiService,
    AuthService,
    AuthGuard
  ]
})
export class GlobalModule { }
