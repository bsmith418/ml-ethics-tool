import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {EnumToAllKey, Strategy} from '../intervention.model';
import {FormGroup} from '@angular/forms';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Filter} from '../controls/controls.component';

export interface CheckedBox{
  key: string;
  isChecked: boolean;
}


@Component({
  selector: 'app-checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss']
})
export class CheckboxListComponent implements OnInit, OnDestroy {

  @Input() title: string;
  @Input() masterEnum: any;
  @Input() filter: Filter;
  @Input() maxSingleCheck = false;

  @Output() checkboxEvent = new EventEmitter<CheckedBox>();
  @Output() filterActivated = new EventEmitter<boolean>();

  anyAllKeys: string[];

  selectedRadio: string;

  filterSubscription: Subscription;

  onCheckboxChange(clickedKey: string, checked: boolean, index: number): void{
    // if (this.maxSingleCheck){
    //   this.checkedArray = this.checkedArray.map((v) => false);
    //   this.checkedArray[index] = checked;
    // }

    this.checkboxEvent.emit({key: clickedKey, isChecked: checked});
  }

  getEnumKeys(anEnum: any): string[] {
    return Object.keys(anEnum);
  }

  constructor() { }

  ngOnInit(): void {

    this.anyAllKeys = Object.values(EnumToAllKey);
    // this.checkedArray = Object.keys(this.masterEnum).map((k) => false);
    // console.log(this.initialCheckedArray);

    this.filterSubscription = this.filter.subject.subscribe((activeFilters) => {
      this.filter.isFiltering = activeFilters?.length > 0;
      if (this.filter.isFiltering){
        this.filterActivated.emit(true);
      }
    });
  }

  ngOnDestroy(): void {
    this.filterSubscription.unsubscribe();
  }

}
