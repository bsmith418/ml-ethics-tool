import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-interventions-viewer',
  templateUrl: './interventions-viewer.component.html',
  styleUrls: ['./interventions-viewer.component.scss']
})
export class InterventionsViewerComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  githubLink = 'https://github.com/bsmith418/ml-ethics-tool';

  // settings courtesy of https://material.angular.io/components/sidenav/examples
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 1202px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // addEventListener not yet implemented in Safari / iOS
    // https://github.com/microsoft/TSJS-lib-generator/issues/550
    this.mobileQuery.addListener(this._mobileQueryListener);
    // this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    // this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

}
