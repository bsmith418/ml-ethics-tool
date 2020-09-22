import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Strategy} from '../intervention.model';
import {InterventionsService} from '../interventions.service';
import {MatButton} from '@angular/material/button';
import {timer} from 'rxjs';
import {take} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-new-intervention-dialog',
  templateUrl: './new-intervention-dialog.component.html',
  styleUrls: ['./new-intervention-dialog.component.scss']
})
export class NewInterventionDialogComponent implements OnInit {

  isValid = false;
  intervention: Strategy = null;

  onCancel(): void {
    this.dialogRef.close();
  }

  onFormChange(newInterventionForm: FormGroup): void{
    this.intervention = newInterventionForm.value;
    this.isValid = newInterventionForm.valid;
  }

  async onSubmit(button: MatButton): Promise<void>{
    button.disabled = true;
    try{
      await this.interventionService.suggestNewStrategy(this.intervention);
      this.openSnackBar('New intervention submitted!', 'Success');
      // await timer(1000).pipe(take(1)).toPromise();
      this.dialogRef.close(this.intervention);
    } catch (e) {
      button.disabled = false;
      this.openSnackBar(e.toString(), 'Error');
    }
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  constructor(
    public dialogRef: MatDialogRef<NewInterventionDialogComponent>,
    private interventionService: InterventionsService,
    private snackBar: MatSnackBar,
  ) {

  }

  ngOnInit(): void {

  }

}
