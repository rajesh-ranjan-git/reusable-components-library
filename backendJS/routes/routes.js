import express from "express";

import {
  controller1,
  controller2,
  controller3,
  controller4,
  controller5,
} from "../controllers/controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/route1", controller1);
router.post("/route2", controller2);
router.put("/route3", controller3);
router.patch("/route4", controller4);
router.delete("/route5", controller5);

router.get("/route1", auth, controller1);
router.post("/route2", auth, controller2);
router.put("/route3", auth, controller3);
router.patch("/route4", auth, controller4);
router.delete("/route5", auth, controller5);

router.get("/route1/:param", auth, controller1);
router.post("/route2/:param", auth, controller2);
router.put("/route3/:param", auth, controller3);
router.patch("/route4/:param", auth, controller4);
router.delete("/route5/:param", auth, controller5);

export default router;
