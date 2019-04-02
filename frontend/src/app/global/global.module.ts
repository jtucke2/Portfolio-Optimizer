import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCardModule, MatToolbarModule } from '@angular/material';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { NavComponent } from './components/nav/nav.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth.guard';
import { AuthInterceptor } from './services/auth-interceptor.service';
import { PageTitleComponent } from './components/page-title/page-title.component';

@NgModule({
  declarations: [
    LandingPageComponent,
    NavComponent,
    PageTitleComponent,
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
    NavComponent,
    PageTitleComponent,
  ],
  providers: [
    ApiService,
    AuthService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class GlobalModule { }
