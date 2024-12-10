import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return Intl.DateTimeFormat("pl-PL", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).format(date);
}

export function readingTime(html: string) {
  const textOnly = html.replace(/<[^>]+>/g, "");
  const wordCount = textOnly.split(/\s+/).length;
  const readingTimeMinutes = ((wordCount / 200) + 1).toFixed();
  return `${readingTimeMinutes} min read`;
}

export function dateRange(startDate: Date, endDate?: Date | string): string {
  const startDateString = startDate.toLocaleString("pl-PL", {month: 'numeric', year: 'numeric'}); 

  const endDateString = typeof endDate === "string" ? endDate : endDate?.toLocaleString("pl-PL", {month: 'numeric', year: 'numeric'}); 

  return `${startDateString} - ${endDateString}`;
} 