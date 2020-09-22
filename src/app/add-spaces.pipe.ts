import { Pipe, PipeTransform } from '@angular/core';


// Make spaces betwixt capitalized words. e.g.:
// CapitalTextExample => Capital Text Example
// NLP => NLP
@Pipe({
  name: 'addSpaces'
})
export class AddSpacesPipe implements PipeTransform {

  transform(text: string, ...args: unknown[]): string {
    if (text){
      // capture capital letters followed by lower case letters
      const capitalLetters = /[A-Z][a-z]/g;
      return text.replace(capitalLetters, ' $&').trim();
    }
    return text;
  }

}
