import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitText'
})
export class LimitTextPipe implements PipeTransform {

  transform(value: string, limit: number = 40, trail: string = '…'): string {
    let result = value || '';
    if (value) {
      if (value.length > limit) {
        result = `${value.substring(0, limit)}...`;
      }
    }
    return result;
  }

}
