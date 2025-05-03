import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
function CalendarView({ cycles }) {
  function tileContent({ date, view }) {
    if (view !== "month") {
      return null;
    }
    for (let i = 0; i < cycles.length; i++) {
      const { start_date, end_date } = cycles[i];
      const start = new Date(start_date).toDateString();
      const end = end_date ? new Date(end_date).toDateString() : null;
      if (start === date.toDateString()) {
        return <p style={{ color: "red" }}>Start 🩸</p>;
      }
      if (end === date.toDateString()) {
        return <p style={{ color: "blue" }}>End 🛑</p>;
      }
    }
    return null;
  }
  return (
    <div className="calendar-component">
      <h2>See your cycle dates on the calendar and get a visual overview:</h2>
      <Calendar tileContent={tileContent} />
    </div>
  );
}
export default CalendarView;
