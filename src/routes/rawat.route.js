import { Router } from "express";
import { addPasien, listPasien } from "../controllers/rawat.controller.js";

const rawatRouter = Router();

rawatRouter.post('/addPasien', addPasien);
rawatRouter.get('/pasien', listPasien);

export default rawatRouter;