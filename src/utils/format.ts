const currencyFormatter = new Intl.NumberFormat("hu-HU", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
});

export class Format {
  private constructor() {}

  static currency(value: number | undefined | null): string {
    return currencyFormatter.format(value || 0).replace(/,/g, ".");
  }

  static percent(value: number | undefined | null): string {
    let percent = value || 0;
    if (percent < 1) percent = percent * 100;
    return `${Math.round(percent)}%`;
  }
}
