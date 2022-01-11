// Vendor
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatIconModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatSliderModule,
  MatSnackBarModule,
  MatToolbarModule,
} from "@angular/material";
import { RouterModule } from "@angular/router";
import { FooterComponent } from "./components/footer/footer.component";
import { LandingPageComponent } from "./components/landing-page/landing-page.component";
import { PageTitleComponent } from "./components/page-title/page-title.component";
import { NumberPipe } from "./pipes/number.pipe";
import { PercentPipe } from "./pipes/percent.pipe";

@NgModule({
  declarations: [
    LandingPageComponent,
    // NavComponent,
    PageTitleComponent,
    // LoadingSpinnerComponent,
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
    MatDividerModule,
  ],
  exports: [
    LandingPageComponent,
    // NavComponent,
    PageTitleComponent,
    // LoadingSpinnerComponent,
    FooterComponent,
    PercentPipe,
    NumberPipe,
  ],
  providers: [
    // ApiService,
    // AuthService,
    // AuthGuard,
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // SnackbarService,
  ],
})
export class GlobalModule {}
