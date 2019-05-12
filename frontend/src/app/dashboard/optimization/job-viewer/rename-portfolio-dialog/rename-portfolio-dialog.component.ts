import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

import { Portfolio } from 'src/app/models/portfolio';

export interface RenameCloseResult {
  action: 'save' | 'cancel';
  nameChanged: boolean;
  portfolioState: Portfolio;
}

@Component({
  selector: 'rename-portfolio-dialog',
  templateUrl: './rename-portfolio-dialog.component.html',
  styleUrls: ['./rename-portfolio-dialog.component.scss']
})
export class RenamePortfolioDialogComponent {
  public nameForm = new FormControl('', Validators.required);

  constructor(
    public dialogRef: MatDialogRef<RenamePortfolioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public portoflio: Portfolio
  ) {
    this.nameForm.patchValue(portoflio.name);
  }

  public cancel() {
    this.dialogRef.close();
  }

  public save() {
    const portfolioState = { ...this.portoflio };
    const nameChanged = this.nameForm.value !== portfolioState.name;
    if (nameChanged) {
      portfolioState.name = this.nameForm.value;
    }
    this.dialogRef.close({
      action: 'save',
      nameChanged,
      portfolioState
    } as RenameCloseResult);
  }
}
