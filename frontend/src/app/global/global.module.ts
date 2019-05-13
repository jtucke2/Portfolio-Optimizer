// Vendor
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatCardModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatSliderModule,
  MatMenuModule,
  MatIconModule,
  MatDividerModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Components
import { NavComponent } from './components/nav/nav.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

// Services
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth.guard';
import { AuthInterceptor } from './services/auth-interceptor.service';
import { SnackbarService } from './services/snackbar.service';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './components/footer/footer.component';
import { PercentPipe } from './pipes/percent.pipe';
import { NumberPipe } from './pipes/number.pipe';

@NgModule({
  declarations: [
    LandingPageComponent,
    NavComponent,
    PageTitleComponent,
    LoadingSpinnerComponent,
    FooterComponent,
    PercentPipe,
    NumberPipe,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    RouterModule,
    HttpClientModule,
    MatSnackBarModule,
    MatSliderModule,
    FormsModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule
  ],
  exports: [
    LandingPageComponent,
    NavComponent,
    PageTitleComponent,
    LoadingSpinnerComponent,
    FooterComponent,
    PercentPipe,
    NumberPipe,
  ],
  providers: [
    ApiService,
    AuthService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    SnackbarService
  ]
})
export class GlobalModule { }
