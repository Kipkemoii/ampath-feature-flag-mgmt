import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TableComponent } from '../shared/table/table.component';
import { Columns } from '../shared/table/table.component.types';
import { FeatureFlagsService } from '../services/feature_flag.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, EMPTY, finalize, switchMap, tap } from 'rxjs';
import { SnackBarUtil } from '../shared/snackbar/snackbar.util';
import { MatDialog } from '@angular/material/dialog';
import { FeatureFlagFormComponent } from './form/feature_flags.form.component';
import { FeatureFlagDefaultValues } from './feature_flags.types';
import { Router } from '@angular/router';
import { VoidFormComponent } from '../shared/dialog/void-dialog/void.form.component';
import { VoidDto } from '../shared/dialog/void-dialog/types';

@Component({
  imports: [TableComponent],
  selector: 'app-feature-flag',
  templateUrl: './feature_flags.component.html',
})
export class FeatureFlagsComponent implements OnInit {
  private featureFlagsService = inject(FeatureFlagsService);
  private snackBar = inject(SnackBarUtil);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  busy = false;

  columns: Columns[] = [
    {
      name: 'Name',
      property: 'name',
    },
    {
      name: 'Description',
      property: 'description',
    },
    {
      name: 'Created By',
      property: 'createdBy',
    },
    {
      name: 'Status',
      property: 'status',
    },
  ];

  dataSource = new MatTableDataSource<object>();

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.busy = true;
    this.featureFlagsService
      .fetch()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.dataSource.data = res;
        }),
        catchError((error) => {
          this.snackBar.open(
            `An error occurred while loading feature flags: ${error.statusText}`,
            'error'
          );
          throw error;
        }),
        finalize(() => {
          this.busy = false;
        })
      )
      .subscribe();
  }

  addBtnClicked() {
    this.dialog
      .open(FeatureFlagFormComponent, {
        data: FeatureFlagDefaultValues,
        width: '800px',
        height: 'auto',
      })
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((result) => {
          if (result) {
            this.dataSource.data = [...this.dataSource.data, result];
          }
        })
      )
      .subscribe();
  }

  editBtnClicked(event: object) {
    this.dialog
      .open(FeatureFlagFormComponent, {
        data: {
          ...event,
          isUpdate: true,
          title: `Edit feature flag`,
          btnText: 'Update',
        },
        width: '800px',
        height: 'auto',
      })
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((result) => {
          if (result) {
            this.dataSource.data = this.dataSource.data.map((v: any) => {
              if (v.id === result.id) {
                v = result;
              }
              return v;
            });
          }
        })
      )
      .subscribe();
  }

  rulesBtnClicked(event: any) {
    const { id, name, description } = event;
    this.router.navigate([
      'home',
      'feature-flags',
      id,
      'rules',
      name,
      description,
    ]);
  }
  deleteBtnClicked($event: any) {
    this.dialog
      .open(VoidFormComponent, {
        data: {},
        width: '800px',
        height: 'auto',
      })
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((res: VoidDto) => {
          if (res) {
            return this.remove($event.id, res);
          } else {
            return EMPTY;
          }
        }),
        tap((result) => {
          if (result) {
            this.fetchData();
          }
        })
      )
      .subscribe();
  }
  remove(ruleId: number, voidDto: VoidDto) {
    return this.featureFlagsService.delete(ruleId, voidDto).pipe(
      tap(() => {
        this.snackBar.open(`Feature flag deleted successfully`, 'success');
      }),
      catchError((error) => {
        this.snackBar.open(
          `An error occurred while deleting the feature flag: ${error.statusText}`,
          'error'
        );
        throw error;
      })
    );
  }
}
