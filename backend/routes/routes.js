import express from "express";
const router = express.Router();
import {
  createCycle,
  cycleComplete,
  deleteCycle,
  editCycle,
  fecthCycles,
} from "../controller/useController.js";
router.post("/create-cycle", createCycle);
router.get("/cycles", fecthCycles);
router.put("/update-cycle/:id", editCycle);
router.delete("/delete-cycle/:id", deleteCycle);
router.patch("/cycle-complete/:id", cycleComplete);
export default router;
