import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
	return Intl.DateTimeFormat("zh-cn", {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
	}).format(date);
}

export function readingTime(html: string) {
	const textOnly = html.replace(/<[^>]+>/g, "");
	const wordCount = textOnly.split(/\s+/).length;
	const readingTimeMinutes = (wordCount / 200 + 1).toFixed();
	return `${readingTimeMinutes} min read`;
}

export function dateRange(startDate: Date, endDate?: Date | string): string {
	const startMonth = startDate.toLocaleString("default", { month: "2-digit" });
	const startYear = startDate.toLocaleString("default", { year: "numeric" });
	let endMonth = "";
	let endYear = "";

	if (endDate) {
		if (typeof endDate === "string") {
			endMonth = "";
			endYear = endDate;
		} else {
			endMonth = endDate.toLocaleString("default", { month: "2-digit" });
			endYear = endDate.toLocaleString("default", { year: "numeric" });
		}
	}

	return `${startYear}${startMonth} - ${endYear}${endMonth}`;
}
