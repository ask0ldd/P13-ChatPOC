import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  /**
   * Transforms a date string into a formatted date and time string.
   * 
   * @param {string} value - The input date string to be formatted.
   * @returns {string} The formatted date and time string in the format "DD/MM/YYYY HHhMM".
   * 
   * @example
   * // Input: "2024-07-19T15:30:00Z"
   * // Output: "19/07/2024 15h30"
   */
  transform(value: string): string {
    const date = new Date(value);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}h${minutes}`;
  }

}
