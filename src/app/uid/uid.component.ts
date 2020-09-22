import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-uid',
  templateUrl: './uid.component.html',
  styleUrls: ['./uid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UidComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
  }

}
