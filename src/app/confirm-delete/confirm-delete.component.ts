import {Component, Inject, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {InterventionsService} from '../interventions.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Strategy} from '../intervention.model';
import {timer} from 'rxjs';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss']
})
export class ConfirmDeleteComponent implements OnInit {

  // async onConfirmDelete(button: MatButton): Promise<void>{
  //
  //   button.disabled = true;
  //   try{
  //     await this.interventionsService.deleteStrategy(this.intervention);
  //     this.openSnackBar('Strategy deleted!', 'Success');
  //     // await timer(1000).pipe(take(1)).toPromise();
  //     this.dialogRef.close();
  //   } catch (e) {
  //     button.disabled = false;
  //     this.openSnackBar(e.toString(), 'Error');
  //   }
  // }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }


  constructor(
    private interventionsService: InterventionsService,
    public dialogRef: MatDialogRef<ConfirmDeleteComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public intervention: Strategy,
  ) { }

  ngOnInit(): void {
  }

}
