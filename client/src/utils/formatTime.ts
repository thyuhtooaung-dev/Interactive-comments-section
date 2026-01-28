import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import type { Locale } from "date-fns";

const tokenMap: Record<string, string> = {
  lessThanXSeconds: "just now",
  xSeconds: "just now",
  halfAMinute: "30s",
  lessThanXMinutes: "1 min",
  xMinutes: "{count} min",
  aboutXHours: "{count} h",
  xHours: "{count} h",
  xDays: "{count} d",
  aboutXMonths: "{count} mo",
  xMonths: "{count} mo",
  aboutXYears: "{count} y",
  xYears: "{count} y",
  overXYears: "{count} y",
};

const customLocale: Locale = {
  ...enUS,
  formatDistance: (
    token: string,
    count: number,
    options?: { addSuffix?: boolean; comparison?: number },
  ) => {
    let result = tokenMap[token] ?? "{count} " + token;
    if (result.includes("{count}")) {
      result = result.replace("{count}", count.toString());
    }

    if (options?.addSuffix) {
      if (options.comparison && options.comparison > 0) {
        return `in ${result}`;
      }
      return `${result} ago`;
    }

    return result;
  },
};

export const formattedTime = (date: string | number | Date): string => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: customLocale,
  });
};
