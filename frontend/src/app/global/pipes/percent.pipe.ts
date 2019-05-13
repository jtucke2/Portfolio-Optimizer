import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percent'
})
export class PercentPipe implements PipeTransform {

  transform(value: number, digits: number = 4): string {
    return `${(value * 100).toFixed(digits)}%`;
  }

}
