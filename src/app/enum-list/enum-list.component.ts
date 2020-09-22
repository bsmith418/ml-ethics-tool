import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CheckedBox} from '../checkbox-list/checkbox-list.component';
import {BehaviorSubject, Subscription} from 'rxjs';
import { EnumToAllKey } from '../intervention.model';


export interface EnumChipState{
  enumKey: string;
  isSelected: boolean;
}

@Component({
  selector: 'app-enum-list',
  templateUrl: './enum-list.component.html',
  styleUrls: ['./enum-list.component.scss']
})
export class EnumListComponent implements OnInit, OnDestroy {

  @Input()
  masterEnum: any; // the governing enum
  @Input()
  enumKeys: string[]; // the particular parts of the enum to display
  @Input()
  isChecklist = false; // whether or not to append checkmarks on chips
  @Input()
  filter$: BehaviorSubject<string[]>;

  @Output() selectedEnumKey = new EventEmitter<string>();

  enumChips: EnumChipState[];

  EnumToAllKey = EnumToAllKey;

  filterSubscription: Subscription;

  getTooltip(enumKey: string): string {
    return this.masterEnum[enumKey];
  }

  isAllKey(enumKey: string): boolean{
    return (Object.values(EnumToAllKey) as string[]).includes(enumKey);
  }

  handleClick(index: number): void{
    if ( this.enumChips[index].isSelected ){
      this.filter$.next(null);
      // this.enumChips[index].isSelected = false;
      // this.selectedEnumKey.emit(null);
    } else if ( !this.isAllKey(this.enumChips[index].enumKey) ){
      this.filter$.next([this.enumChips[index].enumKey]);
      // this.enumChips.forEach((chip) => chip.isSelected = false);
      // this.enumChips[index].isSelected = true;
      // this.selectedEnumKey.emit(this.enumChips[index].enumKey);
    }
  }

  constructor() { }

  ngOnInit(): void {
    this.enumChips = this.enumKeys.map( (key) => {
      return {enumKey: key, isSelected: false};
    });

    this.filterSubscription = this.filter$.subscribe((filter) => {
      this.enumChips.forEach( (chip) => {
        chip.isSelected = filter?.includes(chip.enumKey);
      });
    });

  }

  ngOnDestroy(): void {
    this.filterSubscription.unsubscribe();
  }

}
