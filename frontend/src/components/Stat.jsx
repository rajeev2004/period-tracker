import React, { useMemo, useState, useEffect } from "react";
import blood from "../assets/blood.png";
import calendar from "../assets/calendar.png";
import ovulation from "../assets/ovulation.webp";
function Stat({ cycles }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(
      () => setCurrentDate(new Date()),
      1000 * 60 * 60 * 24
    );
    return () => clearInterval(interval);
  }, []);
  const stats = useMemo(() => {
    if (!cycles || cycles.length == 0) {
      return null;
    }
    const completeCycle = cycles.filter((cycle) => cycle.end_date);
    if (completeCycle.length == 0) {
      return null;
    }
    const sortedCompleteCycles = [...completeCycle].sort(
      (a, b) => new Date(a.end_date) - new Date(b.end_date)
    );
    const ongoingCycle = cycles.filter((cycle) => !cycle.end_date);
    const totalDuration = completeCycle.map(
      (cycle) =>
        (new Date(cycle.end_date) - new Date(cycle.start_date)) /
        (60 * 60 * 24 * 1000)
    );
    const avgDuration = Math.round(
      totalDuration.reduce((accumulator, current) => accumulator + current, 0) /
        totalDuration.length
    );
    let totalGap = 0;
    for (let i = 1; i < sortedCompleteCycles.length; i++) {
      const cycleEnd = new Date(sortedCompleteCycles[i - 1].end_date);
      const cycleStart = new Date(sortedCompleteCycles[i].start_date);
      const gap = (cycleEnd - cycleStart) / (1000 * 24 * 60 * 60);
      totalGap += gap;
    }
    totalGap = Math.round(totalGap);
    const lastCompletedCycle = new Date(
      sortedCompleteCycles[sortedCompleteCycles.length - 1].end_date
    );
    const nextPeriodDate = new Date(lastCompletedCycle);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + avgDuration + totalGap);
    const nextPeriodDays = Math.round(
      (nextPeriodDate - currentDate) / (1000 * 24 * 60 * 60)
    );
    const sortedCycles = [...cycles].sort(
      (a, b) => new Date(b.start_date) - new Date(a.start_date)
    );
    const latestCycle = sortedCycles[0];
    const periodEndDate = new Date(latestCycle.start_date);
    periodEndDate.setDate(periodEndDate.getDate() + Math.round(avgDuration));
    const periodEndDays = Math.round(
      (periodEndDate - currentDate) / (1000 * 24 * 60 * 60)
    );
    const ovulationDate = new Date(latestCycle.start_date);
    ovulationDate.setDate(ovulationDate.getDate() + 14);
    const ovulationDays = Math.round(
      (ovulationDate - currentDate) / (1000 * 24 * 60 * 60)
    );
    const recentCycles = sortedCycles.slice(0, 4);
    const symptoms = {};
    for (let cycle of recentCycles) {
      for (let key in cycle) {
        if (
          [
            "cramps",
            "headache",
            "fatigue",
            "nausea",
            "mood_swings",
            "bloating",
          ].includes(key) &&
          cycle[key]
        ) {
          symptoms[key] = (symptoms[key] || 0) + 1;
        }
      }
    }
    const topSymptoms = Object.entries(symptoms)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([symptom]) => symptom)
      .join(", ");
    return {
      avgDuration,
      nextPeriodDays,
      ovulationDays,
      topSymptoms,
      periodEndDays,
      ongoingCycle,
      completeCycle,
    };
  }, [cycles, currentDate]);
  if (!stats) {
    return (
      <div className="stats-container">
        <h2>
          Here’s a summary of your average cycle, ovulation, and most common
          symptoms:
        </h2>
        <p>Not Enough data to display Summary of stats.</p>
      </div>
    );
  }
  return (
    <div className="stats-container">
      <h2>
        Here’s a summary of your average cycle, ovulation, and most common
        symptoms:
      </h2>
      <div>
        <p>
          • Average Cycle Duration: <strong>{stats.avgDuration}</strong> days ±
          2 days
        </p>
        <img src={calendar} />
      </div>
      {stats.ongoingCycle.length === 0 ? (
        stats.completeCycle.length >= 2 && (
          <div>
            <p>
              • Next Period In: <strong>{stats.nextPeriodDays}</strong> days ± 2
              days
            </p>
            <img src={blood} />
          </div>
        )
      ) : (
        <div>
          <p>
            • Period Ends In: <strong>{stats.periodEndDays}</strong> days ± 2
            days
          </p>
          <img src={blood} />
        </div>
      )}
      {stats.ongoingCycle.length !== 0 ? (
        <div>
          <p>
            {stats.ovulationDays >= 0 ? (
              <p>
                • Ovulation In: <strong>{stats.ovulationDays}</strong> days ± 2
                days
              </p>
            ) : (
              <p>
                • <strong>Ovulation Already begun</strong>
              </p>
            )}
          </p>
          <img src={ovulation} />
        </div>
      ) : (
        <div>
          <p>• Ovulation: No Cycle Is ongoing Right now.</p>
          <img src={ovulation} />
        </div>
      )}

      <p>
        • Most Common Symptom:{" "}
        <strong>
          {stats.topSymptoms
            .replace("_", " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </strong>
      </p>
    </div>
  );
}
export default Stat;
