import timesheet from "@/data/timesheet.json";
import { dayTotal, daysInMonth, formatDate, formatHours, monthTotal, validateTimesheet, type TimesheetData } from "@/lib/time-calculator";
import { CalendarDays, Clock3, FileText } from "lucide-react";

const data = timesheet as TimesheetData;
const errors = validateTimesheet(data);
const total = monthTotal(data);
const daysCount = daysInMonth(data.year, data.month);
const monthLabel = new Intl.DateTimeFormat("vi-VN", { month: "long", year: "numeric" }).format(new Date(data.year, data.month - 1, 1));
const days = Array.from({ length: daysCount }, (_, index) => {
  const date = `${data.year}-${String(data.month).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`;
  const record = data.days.find((item) => item.date === date);
  return { date, record, total: record ? dayTotal(record) : 0 };
});
export const dynamic = "force-static";

export default function Home() {
  return <main className="page-shell"><div className="container">
    <header className="topbar"><div className="brand-mark"><Clock3 size={22} /></div><div><p className="eyebrow">THEO DÕI THỜI GIAN LÀM VIỆC</p><h1>{data.owner || "Bảng chấm công"}</h1></div></header>
    {errors.length > 0 && <section className="error-panel"><strong>Dữ liệu cần kiểm tra</strong><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></section>}
    <section className="summary-card" aria-label="Tổng giờ làm trong tháng"><div className="summary-top"><div className="summary-icon"><CalendarDays size={19} /></div><span className="month-pill">{monthLabel}</span></div><p className="summary-label">TỔNG SỐ GIỜ LÀM</p><div className="summary-number">{formatHours(total)} <span>giờ</span></div><p className="summary-footnote">Tổng thời gian của {data.days.filter((day) => day.shift1 || day.shift2).length} ngày có ghi nhận dữ liệu</p></section>
    <section className="days-section"><div className="section-heading"><div><p className="eyebrow">CHI TIẾT</p><h2>Công việc từng ngày</h2></div><span className="days-count">{daysCount} ngày</span></div>
      <div className="day-list">{days.map(({ date, record, total: hours }) => { const hasWork = Boolean(record?.shift1 || record?.shift2); return <article className={`day-card ${hasWork ? "has-work" : "no-work"}`} key={date}>
        <div className="day-card-head"><div className="date-block"><span className="date-number">{Number(date.slice(-2))}</span><span className="date-label">{formatDate(date)}</span></div><div className={`day-total ${hasWork ? "" : "muted"}`}>{hasWork ? `${formatHours(hours)} giờ` : "—"}</div></div>
        <div className="shift-list"><div className="shift-row"><span className="shift-label">Ca 1</span><span className="shift-time">{record?.shift1 || "Không có dữ liệu"}</span></div><div className="shift-row"><span className="shift-label">Ca 2</span><span className="shift-time">{record?.shift2 || "Không có dữ liệu"}</span></div></div>
      </article>; })}</div>
    </section>
    <footer className="footer"><FileText size={15} /><span>Dữ liệu chấm công được cập nhật bởi người quản lý.</span></footer>
  </div></main>;
}
