import React, { useState, useEffect } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
function CycleList({ cycles, onCycleChange, page, hasNext }) {
  const backend = import.meta.env.VITE_BACKEND_URL;
  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState({
    start_date: "",
    end_date: "",
    notes: "",
  });
  const [editSymptoms, setEditSymptoms] = useState({
    cramps: false,
    headache: false,
    fatigue: false,
    nausea: false,
    mood_swings: false,
    bloating: false,
  });
  const [editFlow, setEditFlow] = useState({
    flow_intensity: "",
    flow_color: "",
    clotting: "",
  });
  function formatDate(date) {
    if (!date) {
      return;
    }
    const DATE = new Date(date);
    return DATE.toISOString().split("T")[0];
  }
  function startEdit(cycle) {
    setEditingId(cycle.id);
    setEditDate({
      start_date: formatDate(cycle.start_date),
      end_date: formatDate(cycle.end_date),
      notes: cycle.notes || "",
    });
    setEditSymptoms({
      cramps: cycle.cramps,
      headache: cycle.headache,
      fatigue: cycle.fatigue,
      nausea: cycle.nausea,
      mood_swings: cycle.mood_swings,
      bloating: cycle.bloating,
    });
    setEditFlow({
      flow_intensity: cycle.flow_intensity,
      flow_color: cycle.flow_color,
      clotting: cycle.clotting,
    });
  }
  function handleDateChange(e) {
    const { name, value } = e.target;
    setEditDate((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  function handleSymptomChange(e) {
    const { name, checked } = e.target;
    setEditSymptoms((prev) => ({
      ...prev,
      [name]: checked,
    }));
  }
  function handleNoteChange(e) {
    setEditDate((prev) => ({
      ...prev,
      notes: e.target.value,
    }));
  }
  function handleFlowChange(e) {
    const { name, value } = e.target;
    setEditFlow((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  async function saveEdit(id) {
    try {
      const result = await axios.put(`${backend}/update-cycle/${id}`, {
        ...editDate,
        ...editSymptoms,
        ...editFlow,
      });
      if (result.data.message === "Cycle updated") {
        alert("Cycle Updated");
        setEditingId(null);
        onCycleChange();
      }
    } catch (err) {
      console.error(
        err.response?.data?.error || err.message || "Something went wrong"
      );
      alert("Failed to update Cycle");
    }
  }
  async function deleteCycle(id) {
    if (!window.confirm("Are you sure you want to delete this Cycle")) {
      return;
    }
    try {
      const result = await axios.delete(`${backend}/delete-cycle/${id}`);
      if (result.data.message === "Cycle Deleted") {
        alert("Cycle Deleted");
        onCycleChange();
      }
    } catch (err) {
      console.error(
        err.response?.data?.error || err.message || "Something went wrong"
      );
      alert("Failed to delete Cycle");
    }
  }
  async function completeCycle(id) {
    const today = new Date().toISOString().split("T")[0];
    try {
      const result = await axios.patch(`${backend}/cycle-complete/${id}`, {
        end_date: today,
      });
      if (result.data.message === "Cycle Finished") {
        alert("Cycle Finished");
        onCycleChange();
      }
    } catch (err) {
      console.log(
        err.response?.data?.error || err.message || "Something Went wrong"
      );
      alert("Something Went Wrong");
    }
  }
  function nextPage() {
    onCycleChange(page + 1);
    setEditingId(null);
  }
  function prevPage() {
    onCycleChange(page - 1);
    setEditingId(null);
  }
  return (
    <div className="cycle-list">
      <h2>List of all the cycles you’ve entered:</h2>
      <div className="cycle-list-child">
        {cycles.length > 0 ? (
          cycles.map((cycle) => {
            return editingId === cycle.id ? (
              <div key={cycle.id} className="cycle-edit">
                <input
                  type="date"
                  placeholder="Starting date"
                  name="start_date"
                  value={editDate.start_date}
                  onChange={handleDateChange}
                  max={new Date().toISOString().split("T")[0]}
                />
                <input
                  type="date"
                  placeholder="Ending date"
                  name="end_date"
                  value={editDate.end_date}
                  onChange={handleDateChange}
                  min={editDate.start_date}
                  max={new Date().toISOString().split("T")[0]}
                />
                <div className="cycle-edit-symptom">
                  {[
                    "cramps",
                    "headache",
                    "fatigue",
                    "nausea",
                    "mood_swings",
                    "bloating",
                  ].map((symptom) => {
                    return (
                      <label key={symptom}>
                        <input
                          type="checkbox"
                          name={symptom}
                          checked={editSymptoms[symptom]}
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
                  value={editFlow.clotting}
                  onChange={handleFlowChange}
                >
                  <option value="">Clotting</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
                <select
                  name="flow_intensity"
                  value={editFlow.flow_intensity}
                  onChange={handleFlowChange}
                >
                  <option value="">Flow Intensity</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="heavy">Heavy</option>
                </select>
                <select
                  name="flow_color"
                  value={editFlow.flow_color}
                  onChange={handleFlowChange}
                >
                  <option value="">Flow Color</option>
                  <option value="light">Light</option>
                  <option value="normal">Normal</option>
                  <option value="dark">Dark</option>
                </select>
                <textarea
                  type="text"
                  placeholder="Add notes..."
                  name="notes"
                  value={editDate.notes}
                  onChange={handleNoteChange}
                  rows={3}
                />
                <div className="cycle-button">
                  <button onClick={() => saveEdit(cycle.id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div key={cycle.id} className="cycle-item">
                <p>
                  <strong>{formatDate(cycle.start_date)}</strong> →{" "}
                  <strong>{formatDate(cycle.end_date) || "Ongoing"}</strong>
                </p>
                <p>
                  <strong>Symptoms: </strong>
                  {[
                    "cramps",
                    "headache",
                    "fatigue",
                    "nausea",
                    "mood_swings",
                    "bloating",
                  ]
                    .filter((symptom) => cycle[symptom])
                    .map((symptom) =>
                      symptom
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())
                    )
                    .join(", ")}
                </p>
                <p>
                  Flow Intensity: <strong>{cycle.flow_intensity}</strong>
                </p>
                <p>
                  Flow Color: <strong>{cycle.flow_color || "No Flow"}</strong>
                </p>
                <p>
                  Clotting: <strong>{cycle.clotting || "No Clotting"}</strong>
                </p>
                <p>
                  {cycle.notes && (
                    <p>
                      <strong>Notes:</strong> {cycle.notes}
                    </p>
                  )}
                </p>
                <div className="cycle-button">
                  <button onClick={() => startEdit(cycle)}>Edit</button>
                  <button onClick={() => deleteCycle(cycle.id)}>Delete</button>
                  {!cycle.end_date && (
                    <button onClick={() => completeCycle(cycle.id)}>
                      Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p>No Cycles to display...</p>
        )}
      </div>
      <div className="pagination-button">
        <button onClick={prevPage} disabled={page === 1}>
          <ArrowBackIcon />
        </button>
        <p>{page}</p>
        <button onClick={nextPage} disabled={hasNext === false}>
          <ArrowForwardIcon />
        </button>
      </div>
    </div>
  );
}
export default CycleList;
