import {Component, OnInit, Input, Output, EventEmitter, ContentChild} from '@angular/core';
import {Objective, Strategy, DataType, DevStage, PromotedValue, MLCategory} from '../intervention.model';
import {InterventionsService} from '../interventions.service';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-strategy-card',
  templateUrl: './strategy-card.component.html',
  styleUrls: ['./strategy-card.component.scss']
})
export class StrategyCardComponent implements OnInit {

  Objective = Objective;
  DataType = DataType;
  DevStage = DevStage;
  PromotedValue = PromotedValue;
  MLCategory = MLCategory;

  public objectivesFilter$ = this.strategyService.objectivesFilter$;
  public devStageFilter$ = this.strategyService.devStageFilter$;
  public dataTypeFilter$ = this.strategyService.dataTypeFilter$;
  public promotedValuesFilter$ = this.strategyService.promotedValuesFilter$;
  public mlCategoriesFilter$ = this.strategyService.mlCategoriesFilter$;

  @Input()
  strategy: Strategy;


  setFilter(observable$: BehaviorSubject<any>, enumKey: string): void{
    observable$.next(enumKey);
  }


  constructor(public strategyService: InterventionsService) { }

  ngOnInit(): void {
  }

}
