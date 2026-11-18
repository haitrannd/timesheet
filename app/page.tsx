"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, FileText, LoaderCircle } from "lucide-react";
import {
  dayTotal,
  formatDate,
  formatHours,
  monthTotal,
  validateTimesheet,
  type TimesheetData,
} from "@/lib/time-calculator";

type TimesheetIndex = { owner?: string; months: string[] };

function monthName(key: string): string {
  const [year, month] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("vi-VN", { month: "long", year: "numeric" }).format(
    new Date(year, month - 1, 1),
  );
}

export default function Home() {
  const [index, setIndex] = useState<TimesheetIndex | null>(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [data, setData] = useState<TimesheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/data/timesheets/index.json", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Không thể tải danh sách tháng.");
        return response.json() as Promise<TimesheetIndex>;
      })
      .then((result) => {
        if (!Array.isArray(result.months)) throw new Error("Danh sách tháng không đúng định dạng.");
        const months = [...new Set(result.months)].filter((month) => /^\d{4}-(0[1-9]|1[0-2])$/.test(month)).sort().reverse();
        if (!active) return;
        setIndex({ ...result, months });
        if (months.length === 0) {
          setError("Chưa có tháng chấm công nào. Hãy thêm dữ liệu vào thư mục public/data/timesheets.");
          setLoading(false);
          return;
        }
        setSelectedMonth(months[0]);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : "Đã xảy ra lỗi khi tải dữ liệu.");
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!selectedMonth) return;
    let active = true;
    setLoading(true);
    setError("");
    setData(null);
    fetch(`/data/timesheets/${selectedMonth}.json`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`Không tìm thấy dữ liệu tháng ${selectedMonth}.`);
        return response.json() as Promise<TimesheetData>;
      })
      .then((result) => {
        if (!active) return;
        setData(result);
        setLoading(false);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : "Đã xảy ra lỗi khi tải dữ liệu.");
        setLoading(false);
      });
    return () => { active = false; };
  }, [selectedMonth]);

  const errors = useMemo(() => data ? validateTimesheet(data) : [], [data]);
  const recordedDays = useMemo(
    () => data?.days
      .filter((day) => Boolean(day.shift1?.trim() || day.shift2?.trim()))
      .sort((a, b) => a.date.localeCompare(b.date)) ?? [],
    [data],
  );
  const total = data ? monthTotal(data) : 0;
  const owner = data?.owner || index?.owner || "Bảng chấm công";

  return (
    <main className="page-shell">
      <div className="container">
        <header className="topbar">
          <div className="brand-mark"><Clock3 size={22} /></div>
          <div>
            <p className="eyebrow">THEO DÕI THỜI GIAN LÀM VIỆC</p>
            <h1>{owner}</h1>
          </div>
        </header>

        <section className="month-picker-card" aria-label="Chọn tháng chấm công">
          <label htmlFor="month-select">XEM BẢNG CHẤM CÔNG</label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            disabled={!index || index.months.length === 0 || loading}
          >
            {index?.months.map((month) => <option key={month} value={month}>{monthName(month)}</option>)}
          </select>
        </section>

        {error && <section className="error-panel"><strong>Không tải được dữ liệu</strong><p>{error}</p></section>}
        {errors.length > 0 && <section className="error-panel"><strong>Dữ liệu cần kiểm tra</strong><ul>{errors.map((item) => <li key={item}>{item}</li>)}</ul></section>}

        {loading ? (
          <div className="loading-state"><LoaderCircle className="spinner" size={22} /><span>Đang tải bảng chấm công...</span></div>
        ) : data ? (
          <>
            <section className="summary-card" aria-label="Tổng giờ làm trong tháng">
              <div className="summary-top">
                <div className="summary-icon"><CalendarDays size={19} /></div>
                <span className="month-pill">{monthName(selectedMonth)}</span>
              </div>
              <p className="summary-label">TỔNG SỐ GIỜ LÀM</p>
              <div className="summary-number">{formatHours(total)} <span>giờ</span></div>
              <p className="summary-footnote">Tổng thời gian của {recordedDays.length} ngày có ghi nhận dữ liệu</p>
            </section>

            <section className="days-section">
              <div className="section-heading">
                <div><p className="eyebrow">CHI TIẾT</p><h2>Công việc từng ngày</h2></div>
                <span className="days-count">{recordedDays.length} ngày có dữ liệu</span>
              </div>
              {recordedDays.length > 0 ? (
                <div className="day-list">
                  {recordedDays.map((day) => (
                    <article className="day-card has-work" key={day.date}>
                      <div className="day-card-head">
                        <div className="date-block">
                          <span className="date-number">{Number(day.date.slice(-2))}</span>
                          <span className="date-label">{formatDate(day.date)}</span>
                        </div>
                        <div className="day-total">{formatHours(dayTotal(day))} giờ</div>
                      </div>
                      <div className="shift-list">
                        <div className="shift-row"><span className="shift-label">Ca 1</span><span className="shift-time">{day.shift1?.trim() || "—"}</span></div>
                        <div className="shift-row"><span className="shift-label">Ca 2</span><span className="shift-time">{day.shift2?.trim() || "—"}</span></div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-state">Tháng này chưa có ngày chấm công nào.</div>
              )}
            </section>
          </>
        ) : null}

        <footer className="footer"><FileText size={15} /><span>Dữ liệu chấm công được cập nhật bởi người quản lý.</span></footer>
      </div>
    </main>
  );
}
