import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCardModule, MatToolbarModule } from '@angular/material';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { NavComponent } from './components/nav/nav.component';
import { RouterModule } from '@angular/router';

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
    RouterModule
  ],
  exports: [
    LandingPageComponent,
    NavComponent
  ]
})
export class GlobalModule { }
