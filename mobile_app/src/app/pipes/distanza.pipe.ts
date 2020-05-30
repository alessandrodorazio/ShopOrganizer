import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'distanza'})
export class DistanzaPipe implements PipeTransform {
  transform(dist: number): string {
    if (dist === null) { return null; }
    return (dist < 1) ? ((dist * 1000).toFixed(0) + 'm') : (dist.toFixed(2) + 'Km');
  }
}
