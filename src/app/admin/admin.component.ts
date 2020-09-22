import {Component, OnDestroy, OnInit} from '@angular/core';
import {EditObj, InterventionsService} from '../interventions.service';
import {Strategy} from '../intervention.model';


// TODO: instead of relying on propertyORIGINAL in Edit objects to compare the old value, fetch the live value
// Otherwise, the proposed edit could be misleading
// (e.g. the property has already been changed, and that change will be unknowingly overwritten)

// TODO: for deletion requests, fetch the live document
// we're currently just looking at a snapshot of the document when the delete was requested

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  newStrategies$ = this.strategiesService.newStrategies$;
  edits$ = this.strategiesService.editStrategies$;
  deleteStrategies$ = this.strategiesService.deleteStrategies$;

  newCount$ = this.strategiesService.newStrategiesCount$;
  editCount$ = this.strategiesService.editStrategiesCount$;
  deleteCount$ = this.strategiesService.deleteStrategiesCount$;

  strategyProperties: string[];


  async approveNew(strategy: Strategy): Promise<void>{
    this.strategiesService.approveNewStrategy(strategy);
  }

  async rejectNew(strategy: Strategy): Promise<void>{
    this.strategiesService.rejectNewStrategy(strategy);
  }

  async acceptEdit(edit: EditObj, property: string): Promise<void>{
    return this.strategiesService.acceptEdit(edit, property);
  }
  async rejectEdit(edit: EditObj, property: string): Promise<void>{
    return this.strategiesService.rejectEdit(edit, property);
  }

  async acceptDeletion(strategy: Strategy): Promise<void>{
    this.strategiesService.acceptDeletion(strategy);
  }
  async rejectDeletion(strategy: Strategy): Promise<void>{
    this.strategiesService.rejectDeletion(strategy);
  }



  constructor(public strategiesService: InterventionsService) { }

  ngOnInit(): void {
    this.strategyProperties = Object.getOwnPropertyNames(new Strategy());
  }

}
