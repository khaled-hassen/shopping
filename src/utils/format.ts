const currencyFormatter = new Intl.NumberFormat("hu-HU", {
  style: "currency",
  currency: "EUR",
});

export class Format {
  private constructor() {}

  static currency(value: number | undefined): string {
    return currencyFormatter.format(value || 0).replace(/,/g, ".");
  }
}
