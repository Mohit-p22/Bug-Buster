export function arrayToDateTime(arr) {
    // Destructure the array
    let [year, month, day, hours, minutes, seconds, milliseconds] = arr;

    // Adjust month (JavaScript months are 0-based)
    month = month - 1;

    // Cap milliseconds to 0–999 (assuming 799719000 is a mistake)
    milliseconds = milliseconds % 1000; // Use modulo to get valid milliseconds

    // Create Date object
    const date = new Date(year, month, day, hours, minutes, seconds, milliseconds);

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
  }