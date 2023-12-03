const currencyFormatter = new Intl.NumberFormat("hu-HU", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
});

const totalReviewsFormatter = new Intl.NumberFormat("us", {
  notation: "compact",
});

const relativeDateFormatter = new Intl.RelativeTimeFormat("us", {
  numeric: "auto",
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

  static totalReviews(value: number | undefined | null): string {
    return totalReviewsFormatter.format(value || 0);
  }

  static rating(
    avg: number | undefined | null,
    total: number | undefined | null,
  ): string {
    const formattedAvg = (avg || 0).toFixed(1);
    const formattedTotal = this.totalReviews(total);
    return `${formattedAvg} (${formattedTotal})`;
  }

  static relativeDate(date: string): string {
    const now = new Date();
    const then = new Date(date);
    const diff = then.getTime() - now.getTime();

    const minutes = Math.ceil(diff / (1000 * 60));
    if (Math.abs(minutes) < 60)
      return relativeDateFormatter.format(minutes, "minute");

    const hours = Math.ceil(diff / (1000 * 60 * 60));
    if (Math.abs(hours) < 24)
      return relativeDateFormatter.format(hours, "hour");

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (Math.abs(days) < 30) return relativeDateFormatter.format(days, "day");

    const months = Math.ceil(diff / (1000 * 60 * 60 * 24 * 30));
    if (Math.abs(months) < 12)
      return relativeDateFormatter.format(months, "month");

    const years = Math.ceil(diff / (1000 * 60 * 60 * 24 * 30 * 12));
    return relativeDateFormatter.format(years, "year");
  }
}
