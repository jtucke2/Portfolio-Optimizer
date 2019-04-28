import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { globalVars } from '../global-vars';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) { }

  public openSnackbar(message: string, panelClass?: string[], action: string = '', duration: number = globalVars.SNACKBAR_DURATION) {
    this.snackBar.open(message, action, { duration, panelClass });
  }
}
