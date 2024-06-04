import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'premiumRangeFormat'
})
export class PremiumRangeFormatPipe implements PipeTransform {

  transform(input: string): string {
    if (!input) return '';
    const [min, max] = input.split('-').map(Number);
    return `₹${this.formatValue(min)} - ₹${this.formatValue(max)}`;
  }

  private formatValue(value: number): string {
    if (value >= 1000) {
        if (value >= 100000) {
            return `${(value / 100000).toFixed(1)}L`;
        } else {
            return `${(value / 1000).toFixed(0)}K`;
        }
    }
    return value.toString();
  }

}
