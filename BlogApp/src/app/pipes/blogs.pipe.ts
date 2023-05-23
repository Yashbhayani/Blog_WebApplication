import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'replaceLineBreaks' })

export class BlogsPipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/\n/g, '<br/>').replace(/[?]/g,'?<br/><br/>');
  }

}
