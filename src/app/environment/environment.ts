export const Environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api',
  getNumbersArray(number: number): number[] {
    return Array.from({ length: number }, (_, index) => index + 1);
  }
}
