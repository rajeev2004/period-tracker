import React, { useState } from "react";
import axios from "axios";
function CycleForm({ onCycleAdd }) {
  const backend = import.meta.env.VITE_BACKEND_URL;
  const [date, setDate] = useState({
    start: "",
    end: "",
  });
  const [symptoms, setSymptoms] = useState({
    headache: false,
    nausea: false,
    bloating: false,
    cramps: false,
    fatigue: false,
    mood_swings: false,
    notes: "",
  });
  const [flowDetails, setFlowDetails] = useState({
    flow_intensity: "",
    flow_color: "",
    clotting: "",
  });
  function setPeriodDate(e) {
    const { name, value } = e.target;
    setDate((prev) => ({ ...prev, [name]: value }));
  }
  function handleSymptomChange(e) {
    const { name, value, type, checked } = e.target;
    setSymptoms((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }
  async function formSubmit(e) {
    e.preventDefault();
    if (date.end && new Date(date.end) < new Date(date.start)) {
      alert("end date cannot be before start date");
      return;
    }
    try {
      const result = await axios.post(`${backend}/create-cycle`, {
        start_date: date.start,
        end_date: date.end,
        ...symptoms,
        ...flowDetails,
      });
      if (result.data.message === "Cycle created") {
        setDate({ start: "", end: "" });
        setSymptoms({
          headache: false,
          nausea: false,
          bloating: false,
          cramps: false,
          fatigue: false,
          mood_swings: false,
          notes: "",
        });
        setFlowDetails({ flow_intensity: "", flow_color: "", clotting: "" });
        alert("cycle created");
        onCycleAdd();
      }
    } catch (err) {
      console.error(
        err.response?.data?.error || err.message || "something went wrong"
      );
      alert("Something Went wrong");
    }
  }
  function handleFlowChange(e) {
    const { name, value } = e.target;
    setFlowDetails((prev) => ({ ...prev, [name]: value }));
  }
  return (
    <div className="cycle-form-component">
      <form onSubmit={formSubmit} className="cycle-form">
        <h2>
          Enter the details of your menstrual cycle to track your periods:
        </h2>
        <div className="cycle-form-date">
          <div>
            <label>Start Date: </label>
            <input
              type="date"
              name="start"
              placeholder="Enter Starting date"
              value={date.start}
              onChange={setPeriodDate}
              max={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div>
            <label>End Date: </label>
            <input
              type="date"
              name="end"
              placeholder="Enter End date"
              value={date.end}
              onChange={setPeriodDate}
              min={date.start}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
        <h3>Symptoms: Can also be added later if occured during period</h3>
        <div className="cycle-form-symptom">
          {[
            "headache",
            "nausea",
            "mood_swings",
            "bloating",
            "cramps",
            "fatigue",
          ].map((symptom) => {
            return (
              <label key={symptom}>
                <input
                  type="checkbox"
                  name={symptom}
                  checked={symptoms[symptom]}
                  onChange={handleSymptomChange}
                />
                {symptom
                  .replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </label>
            );
          })}
        </div>
        <select
          name="clotting"
          value={flowDetails.clotting}
          onChange={handleFlowChange}
        >
          <option value="">Clotting</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
        <select
          name="flow_intensity"
          value={flowDetails.flow_intensity}
          onChange={handleFlowChange}
        >
          <option value="">Select Flow Intensity</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="heavy">Heavy</option>
        </select>
        <select
          name="flow_color"
          value={flowDetails.flow_color}
          onChange={handleFlowChange}
        >
          <option value="">Select Flow Colour</option>
          <option value="light">Light</option>
          <option value="normal">Normal</option>
          <option value="dark">Dark</option>
        </select>
        <textarea
          name="notes"
          placeholder="Additional notes"
          value={symptoms.notes}
          onChange={handleSymptomChange}
        />
        <button type="submit">Create Period Cycle</button>
      </form>
    </div>
  );
}
export default CycleForm;
