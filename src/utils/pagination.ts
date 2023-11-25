export default class Pagination {
  static pageSize = 15;

  static calculateTotalPages = (totalItems: number) =>
    Math.ceil(totalItems / this.pageSize);

  static calculateSkip = (page: number) => (page - 1) * this.pageSize;
}
