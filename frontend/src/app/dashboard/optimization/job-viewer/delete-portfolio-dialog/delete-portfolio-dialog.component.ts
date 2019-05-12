import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Portfolio } from 'src/app/models/portfolio';

@Component({
  selector: 'delete-portfolio-dialog',
  templateUrl: './delete-portfolio-dialog.component.html',
  styleUrls: ['./delete-portfolio-dialog.component.scss']
})
export class DeletePortfolioDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeletePortfolioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public portfolio: Portfolio
  ) { }

  public cancel() {
    this.dialogRef.close();
  }

  public delete() {
    this.dialogRef.close({
      action: 'delete',
      portfolioState: this.portfolio
    });
  }
}
