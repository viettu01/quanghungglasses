export const Environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8081/api',
  getNumbersArray(number: number): number[] {
    return Array.from({ length: number }, (_, index) => index + 1);
  },
  toggleSelectAll(selectAll: boolean){
    selectAll = !selectAll;
  }
}
