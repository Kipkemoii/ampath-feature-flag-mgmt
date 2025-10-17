import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, finalize, tap } from 'rxjs';
import { SnackBarUtil } from '../../shared/snackbar/snackbar.util';
import { CommonModule } from '@angular/common';
import { RulesService } from '../../services/rules.service';
import { MatSelectModule } from '@angular/material/select';
import { AttributeTypes } from '../../attributes/attributes.types';
import { OperatorTypes } from '../../operators/operators.types';
import { CreateRuleDto, UpdateRuleDto } from '../rules.types';

@Component({
  selector: 'app-rules-form',
  templateUrl: 'rules.form.component.html',
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesFormComponent implements OnInit {
  private data = inject<any>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<RulesFormComponent>);
  private rulesService = inject(RulesService);
  private snackBar = inject(SnackBarUtil);

  attributes: AttributeTypes[] = [];
  busy = false;
  btnTxt = '';
  isUpdate = false;
  operators: OperatorTypes[] = [];
  value = '';
  title = '';

  pageForm = new FormGroup({
    featureFlagId: new FormControl<number | null>(null, [Validators.required]),
    attributeId: new FormControl<number | null>(null, [Validators.required]),
    operatorId: new FormControl<number | null>(null, [Validators.required]),
    value: new FormControl(this.value, [Validators.required]),
  });

  ngOnInit() {
    this.attributes = this.data.attributes;
    this.btnTxt = this.data.btnText;
    this.isUpdate = this.data.isUpdate;
    this.title = this.data.title;
    this.operators = this.data.operators;
    this.setDefaultFormValues();
  }

  setDefaultFormValues() {
    this.pageForm.patchValue({
      featureFlagId: Number(this.data.featureFlagId),
      attributeId: this.data.attributeId,
      operatorId: this.data.operatorId,
      value: this.data.value,
    });
  }

  onFormSubmit() {
    const payload = this.generateCreatePayload();
    if (!this.isValidCreatePayload(payload)) return;
    if (this.isUpdate) {
      this.update(payload);
    } else {
      this.create(payload);
    }
  }

  isValidCreatePayload(createRuleDto: CreateRuleDto): boolean {
    if (!createRuleDto.attributeId) {
      this.handleError('Please select an attribute!');
      return false;
    }
    if (!createRuleDto.featureFlagId) {
      this.handleError('Feature Flag not selected!');
      return false;
    }
    if (!createRuleDto.operatorId) {
      this.handleError('Please select an operator!');
      return false;
    }
    if (!createRuleDto.value) {
      this.handleError('Please enter a value!');
      return false;
    }
    return true;
  }

  generateCreatePayload(): CreateRuleDto {
    const { featureFlagId, attributeId, operatorId, value } =
      this.pageForm.value;
    return {
      featureFlagId: featureFlagId ?? 0,
      operatorId: operatorId ?? 0,
      value: value ?? 0,
      attributeId: attributeId ?? 0,
    };
  }

  create(createRuleDto: CreateRuleDto) {
    this.busy = true;
    this.rulesService
      .create(createRuleDto)
      .pipe(
        tap((res) => {
          this.snackBar.open(`Rule created successfully`, 'success');
          this.dialogRef.close(res);
        }),
        catchError((error) => {
          const message = error.error.message[0] ?? '';
          this.handleError(
            `An error occurred while creating a rule: ${error.statusText} \n ${message}`
          );
          throw error;
        }),
        finalize(() => {
          this.busy = false;
        })
      )
      .subscribe();
  }
  handleError(msg: string) {
    this.snackBar.open(msg, 'error');
  }

  update(updateRuleDto: UpdateRuleDto) {
    this.busy = true;
    this.rulesService
      .update(this.data.id, updateRuleDto)
      .pipe(
        tap((res) => {
          this.snackBar.open(`Rule updated successfully`, 'success');
          this.dialogRef.close(res);
        }),
        catchError((error) => {
          const message = error.error.message[0] ?? '';
          this.handleError(
            `An error occurred while updating the rule: ${error.statusText} \n ${message}`
          );
          throw error;
        }),
        finalize(() => {
          this.busy = false;
        })
      )
      .subscribe();
  }
}
