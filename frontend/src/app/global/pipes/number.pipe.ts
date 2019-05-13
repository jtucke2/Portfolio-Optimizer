import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'number'
})
export class NumberPipe implements PipeTransform {

  transform(value: number, digits: number = 4): string {
    return value.toFixed(digits);
  }
}
