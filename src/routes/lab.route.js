import {Router} from "express";
import { listPeriksaLab } from "../controllers/lab.controller.js";

const lab = Router();

lab.get("/", listPeriksaLab);

export default lab;