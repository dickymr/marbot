import express from "express";
import validate from "../../middlewares/validate";
import { seatalkValidataion } from "../../validations";
import { seatalkController } from "../../controllers";

const router = express.Router();

router
  .route("/callback")
  .post(validate(seatalkValidataion.callback), seatalkController.callback);

export default router;
