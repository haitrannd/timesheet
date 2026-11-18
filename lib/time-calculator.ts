export type WorkDay = { date: string; shift1?: string; shift2?: string };
export type TimesheetData = { owner?: string; year: number; month: number; days: WorkDay[] };

function parseClock(value: string): number | null {
  const match = value.trim().match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
}

export function durationHours(range?: string): number {
  if (!range?.trim()) return 0;
  const parts = range.split("-");
  if (parts.length !== 2) return 0;
  const start = parseClock(parts[0]);
  const end = parseClock(parts[1]);
  if (start === null || end === null) return 0;
  let minutes = end - start;
  if (minutes < 0) minutes += 1440;
  return minutes / 60;
}

export function dayTotal(day: WorkDay): number {
  return durationHours(day.shift1) + durationHours(day.shift2);
}
export function monthTotal(data: TimesheetData): number {
  return data.days.reduce((sum, day) => sum + dayTotal(day), 0);
}
export function formatHours(value: number): string {
  return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(value);
}
export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit" }).format(new Date(year, month - 1, day));
}
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}
export function validateTimesheet(data: TimesheetData): string[] {
  const errors: string[] = [];
  if (!Number.isInteger(data.year) || data.year < 2000 || data.year > 2100) errors.push("Năm phải là số nguyên từ 2000 đến 2100.");
  if (!Number.isInteger(data.month) || data.month < 1 || data.month > 12) errors.push("Tháng phải là số nguyên từ 1 đến 12.");
  const seen = new Set<string>();
  for (const day of data.days) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day.date)) { errors.push(`Ngày “${day.date}” không đúng định dạng YYYY-MM-DD.`); continue; }
    const [dayYear, dayMonth, dayNumber] = day.date.split("-").map(Number);
    const parsedDate = new Date(dayYear, dayMonth - 1, dayNumber);
    if (parsedDate.getFullYear() !== dayYear || parsedDate.getMonth() !== dayMonth - 1 || parsedDate.getDate() !== dayNumber) {
      errors.push(`Ngày “${day.date}” không tồn tại.`);
      continue;
    }
    if (dayYear !== data.year || dayMonth !== data.month) errors.push(`Ngày “${day.date}” không thuộc tháng ${String(data.month).padStart(2, "0")}/${data.year}.`);
    if (seen.has(day.date)) errors.push(`Ngày “${day.date}” bị lặp.`);
    seen.add(day.date);
    for (const [label, value] of [["Ca 1", day.shift1], ["Ca 2", day.shift2]] as const) {
      if (value && durationHours(value) === 0) errors.push(`${label} ngày ${day.date}: “${value}” không hợp lệ hoặc có thời lượng bằng 0.`);
    }
  }
  return errors;
}
