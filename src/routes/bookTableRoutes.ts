import express from "express";
import { bookTable, getAllTables, mockInsertTableReservation, updateTableStatus, getNewReservations } from "../controllers/bookTableController";
import { authenticateToken } from "../middlewares/authenticateToken";
import { openPlace } from "../middlewares/openPlace";

const router = express.Router();

router.post("/bookTable", authenticateToken, openPlace, bookTable);
router.get("/reservations", authenticateToken, getAllTables);
router.post("/inserttable", mockInsertTableReservation);
router.patch("/reservations/:reservationId/status", authenticateToken, updateTableStatus);
router.get("/newReservation", authenticateToken, getNewReservations);

export default router;