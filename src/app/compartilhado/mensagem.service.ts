import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MensagemService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccessMessage(message: string) {
    this.snackBar.open(message, '✔️', {
      duration: 5000,
      panelClass: ['success-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  showErrorMessage(message: string) {
    this.snackBar.open(message, 'X', {
      duration: 5000,
      panelClass: ['snackbar-error'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}
