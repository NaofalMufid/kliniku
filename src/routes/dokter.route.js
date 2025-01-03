import express from 'express';
import { addDokter, deleteDokter, editDokter, listDokter } from '../controllers/dokter.controller.js';

const dokter = express.Router();

dokter.get("/", listDokter);
dokter.post("/", addDokter);
dokter.put("/:dokId", editDokter);
dokter.delete("/:dokId", deleteDokter);

export default dokter;