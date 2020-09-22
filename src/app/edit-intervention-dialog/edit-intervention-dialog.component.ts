import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {EditObj, InterventionsService} from '../interventions.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Strategy} from '../intervention.model';
import {MatButton} from '@angular/material/button';
import {FormGroup} from '@angular/forms';


@Component({
  selector: 'app-edit-intervention-dialog',
  templateUrl: './edit-intervention-dialog.component.html',
  styleUrls: ['./edit-intervention-dialog.component.scss']
})
export class EditInterventionDialogComponent implements OnInit {

  isValid = false;
  originalStrategy: Strategy;

  showDeletionInput = false;


  onCancel(): void {
    this.dialogRef.close();
  }

  onFormChange(newInterventionForm: FormGroup): void{
    this.strategy = newInterventionForm.value;
    this.isValid = newInterventionForm.valid;
  }

  async onSubmit(button: MatButton): Promise<void>{
    button.disabled = true;

    // create obj containing any edits from the original
    const editObj: EditObj = {originalID: this.originalStrategy.id, originalName: this.originalStrategy.name};

    let foundChange = false;
    Object.keys(this.strategy).forEach((key) => {
      if (!this.isSame(this.strategy[key], this.originalStrategy[key])){
        editObj[`${key}`] = this.strategy[key];
        editObj[`${key}ORIGINAL`] = this.originalStrategy[key];
        foundChange = true;
      }
    });

    if (!foundChange){
      this.openSnackBar('No change detected.', 'Error');
      button.disabled = false;
      return;
    }


    try{
      await this.interventionService.suggestEdit(editObj);
      this.openSnackBar('Edit submitted for review!', 'Success');
      // await timer(1000).pipe(take(1)).toPromise();
      this.dialogRef.close();
    } catch (e) {
      button.disabled = false;
      this.openSnackBar(e.toString(), 'Error');
    }
  }

  isSame(a, b): boolean{
    if (Array.isArray(a)){
      return this.areArraysEqual(a, b);
      // return this.areSetsEqual(new Set(a), new Set(b));
    } else {
      return a === b;
    }
  }

  areArraysEqual(a: string[], b: string[]): boolean {
    return a.length === b.length && [...a].every(value => b.includes(value));
  }

  areSetsEqual(a, b): boolean {
    return a.size === b.size && [...a].every(value => b.has(value));
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  async suggestDelete(reason: string): Promise<void>{
    this.originalStrategy.deletionRequestReason = reason;
    try{
      await this.interventionService.requestDelete(this.originalStrategy);
      this.openSnackBar('Request submitted!', 'Success');
      this.dialogRef.close();
    } catch (e) {
      this.openSnackBar(e.toString(), 'Error');
    }
  }




  constructor(
    public dialogRef: MatDialogRef<EditInterventionDialogComponent>,
    private interventionService: InterventionsService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public strategy: Strategy
  ) {
    this.originalStrategy = Object.assign({}, strategy);
  }

  ngOnInit(): void {

  }


}
