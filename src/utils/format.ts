const currencyFormatter = new Intl.NumberFormat("hu-HU", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
});

export class Format {
  private constructor() {}

  static currency(value: number | undefined): string {
    return currencyFormatter.format(value || 0).replace(/,/g, ".");
  }

  static percent(value: number | undefined): string {
    if (!value) return "0%";
    if (value < 1) return `${value * 100}%`;
    return `${value}%`;
  }
}
