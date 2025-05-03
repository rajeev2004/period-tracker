import React, { useState, useEffect } from "react";
import axios from "axios";
import CycleList from "./CycleList";
import CycleForm from "./CycleForm";
import Stat from "./Stat";
import CalendarView from "./CalendarView";
import periodImg from "../assets/period-tracker.jpg";
function Home() {
  const backend = import.meta.env.VITE_BACKEND_URL;
  const [cycles, setCycles] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  useEffect(() => {
    fetchCycles(page);
  }, [page]);
  async function fetchCycles(page) {
    try {
      const period_cycles = await axios.get(`${backend}/cycles?page=${page}`);
      setCycles(period_cycles.data.cycles);
      setHasNext(period_cycles.data.nextRow);
    } catch (err) {
      console.error(
        err.response?.data?.error || err.message || "Something went wrong"
      );
      alert("Something went wrong");
    }
  }
  return (
    <div className="homepage">
      <h1>Period Tracker</h1>
      <img src={periodImg} alt="A period tracker image" />
      <CycleForm onCycleAdd={fetchCycles} />
      <CycleList
        cycles={cycles}
        onCycleChange={(newPage) => setPage(newPage)}
        page={page}
        hasNext={hasNext}
      />
      <Stat cycles={cycles} />
      <CalendarView cycles={cycles} />
    </div>
  );
}
export default Home;
