import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameFormatter'
})
export class NameFormatterPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    const names = value.split(' ');
    const firstName = names[0];
    const lastName = names[names.length - 1];

    if (names.length === 1) {
      return `${firstName.charAt(0).toUpperCase() + firstName.slice(1)}`;
    }

    const formattedName = `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}`;

    return formattedName;
  }

}
