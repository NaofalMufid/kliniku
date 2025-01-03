import { Router } from "express";
import { riwayatPemeriksaan } from "../controllers/pemeriksaan.controller.js";

const periksa = Router();

periksa.get("/", riwayatPemeriksaan);

export default periksa;