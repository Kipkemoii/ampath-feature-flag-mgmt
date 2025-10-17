import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { VoidDto } from './types';
import { SnackBarUtil } from '../../snackbar/snackbar.util';

@Component({
  selector: 'app-void-form',
  templateUrl: './void.form.component.html',
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoidFormComponent {
  private dialogRef = inject(MatDialogRef<VoidFormComponent>);
  private snackBar = inject(SnackBarUtil);
  title = 'Delete';

  voidForm = new FormGroup({
    voidedReason: new FormControl<string>('', Validators.required),
  });

  onFormSubmit() {
    const payload = this.generateVoidPayload();
    if (!this.isValidCreatePayload(payload)) return;
    this.void(payload);
  }

  isValidCreatePayload(voidDto: VoidDto): boolean {
    if (!voidDto.voidedReason) {
      this.handleError('Please provide a delete reason!');
      return false;
    }
    return true;
  }

  generateVoidPayload(): VoidDto {
    const { voidedReason } = this.voidForm.value;
    return {
      voidedReason: voidedReason ?? '',
    };
  }

  void(voidDto: VoidDto) {
    this.dialogRef.close(voidDto);
  }
  handleError(msg: string) {
    this.snackBar.open(msg, 'error');
  }
}
