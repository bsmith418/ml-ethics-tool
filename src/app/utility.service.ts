import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }
  // '/a/long/path' => ['a','long','path']
  public static urlToSegments = (url: string) => url.substring(1).split('/');
}
