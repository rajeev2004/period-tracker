import db from "../config/db.js";
export async function createCycle(req, res) {
  try {
    const {
      start_date,
      end_date,
      headache,
      mood_swings,
      fatigue,
      nausea,
      bloating,
      cramps,
      notes,
      flow_intensity,
      flow_color,
      clotting,
    } = req.body;
    if (!start_date) {
      alert("Specify the period start date");
      return;
    }
    const result = await db.query(
      "Insert into cycles (start_date,end_date,headache,mood_swings,fatigue,nausea,bloating,cramps,notes,flow_intensity,flow_color,clotting) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *",
      [
        start_date,
        end_date || null,
        headache,
        mood_swings,
        fatigue,
        nausea,
        bloating,
        cramps,
        notes,
        flow_intensity,
        flow_color,
        clotting,
      ]
    );
    res.status(200).json({ message: "Cycle created", cycle: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
export async function fecthCycles(req, res) {
  const { page } = req.query;
  const limit = 3;
  const pageNumber = parseInt(page) || 1;
  const offset = (pageNumber - 1) * limit;
  try {
    const cycles = await db.query(
      "Select * from cycles order by start_date DESC limit $1 offset $2",
      [limit, offset]
    );
    const hasNext = await db.query(
      "Select * from cycles order by start_date DESC limit 1 offset $1",
      [pageNumber * limit]
    );
    let nextRow;
    if (hasNext.rows.length > 0) {
      nextRow = true;
    } else {
      nextRow = false;
    }
    res.status(200).json({ cycles: cycles.rows, nextRow });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
export async function editCycle(req, res) {
  const { id } = req.params;
  const {
    start_date,
    end_date,
    cramps,
    headache,
    fatigue,
    nausea,
    mood_swings,
    bloating,
    notes,
    flow_color,
    flow_intensity,
    clotting,
  } = req.body;
  try {
    const result = await db.query(
      "Update cycles set start_date=$1,end_date=$2,cramps=$3,headache=$4,fatigue=$5,nausea=$6,mood_swings=$7,bloating=$8,notes=$9,flow_color=$10,flow_intensity=$11,clotting=$12 where id=$13 RETURNING *",
      [
        start_date,
        end_date || null,
        cramps,
        headache,
        fatigue,
        nausea,
        mood_swings,
        bloating,
        notes || "",
        flow_color,
        flow_intensity,
        clotting,
        id,
      ]
    );
    if (result.rows.length > 0) {
      return res.status(200).json({ message: "Cycle updated" });
    } else {
      return res.status(404).json({ error: "Cycle Not found! Try again" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
export async function deleteCycle(req, res) {
  const { id } = req.params;
  try {
    const result = await db.query(
      "Delete from cycles where id=$1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cannot Delete the Cycle" });
    }
    return res.status(200).json({ message: "Cycle Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
export async function cycleComplete(req, res) {
  const { id } = req.params;
  const { end_date } = req.body;
  try {
    await db.query("Update cycles set end_date=$1 where id=$2 RETURNING *", [
      end_date,
      id,
    ]);
    return res.status(200).json({ message: "Cycle Finished" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
