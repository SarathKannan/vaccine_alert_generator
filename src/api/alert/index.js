import { Router } from "express";
import { middleware as query, Schema } from "querymen";
import { create, getList, remove } from "./controller";

const get = new Schema({ deviceId: String });

const router = new Router();

router.post("/create", create);
router.post("/remove", remove);
router.get("/getList", query(get), getList);

export default router;
