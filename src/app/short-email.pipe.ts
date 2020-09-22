import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortEmail'
})
export class ShortEmailPipe implements PipeTransform {

  transform(value: string): string {
    let result = value || '';

    if (value){
      // grab first letters or numbers before a non-word character
      const firstWord: RegExp = /^\w+/;
      result = firstWord.exec(result)[0];
    }


    return result;
  }

}
