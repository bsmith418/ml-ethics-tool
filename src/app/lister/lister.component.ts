import {Component, ElementRef, OnInit} from '@angular/core';
import {InterventionsService} from '../interventions.service';
import {DocumentChangeAction} from '@angular/fire/firestore';
import {Strategy, Objective, DataType, DevStage, PromotedValue, MLCategory} from '../intervention.model';
import {MatButton} from '@angular/material/button';
import {NewInterventionDialogComponent} from '../new-intervention-dialog/new-intervention-dialog.component';
import {LoginComponent} from '../login/login.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AuthService} from '../auth.service';
import {EditInterventionDialogComponent} from '../edit-intervention-dialog/edit-intervention-dialog.component';
import {ConfirmDeleteComponent} from '../confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-lister',
  templateUrl: './lister.component.html',
  styleUrls: ['./lister.component.scss']
})
export class ListerComponent implements OnInit {

  InterventionFeatures = Objective;
  DataType = DataType;
  DevStage = DevStage;
  PromotedValue = PromotedValue;
  MLCategory = MLCategory;

  strategies$ = this.interventionsService.filteredStrategies$;

  editStrategy(intervention: Strategy): void {
    if (this.authService.isLoggedIn) {
      const dialogRef = this.dialog.open(EditInterventionDialogComponent, {
        data: intervention
      });
    } else {
      this.dialog.open(LoginComponent);
    }
  }

  async requestDelete(intervention: Strategy): Promise<void> {
    // button.disabled = true;
    try{
      await this.interventionsService.requestDelete(intervention);
    } catch (e){
      console.log(e);
      // button.disabled = false;
    }
  }

  getStrategyID(index: number, strategy: Strategy): string{
    return strategy.id;
  }




  constructor(
    public interventionsService: InterventionsService,
    public authService: AuthService,
    public dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {

  }

}
