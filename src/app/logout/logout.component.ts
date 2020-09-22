import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {InterventionsService} from '../interventions.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  modQueueCount$ = this.strategiesService.totalModQueue$;

  constructor( public auth: AuthService, public strategiesService: InterventionsService ) { }

  async logout(): Promise<any> {
    await this.auth.signOut();
    // return this.router.navigate(['']);
  }

  ngOnInit(): void {
  }

}
