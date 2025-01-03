import { QueryTypes } from "sequelize";
import { DB_APP } from "../config/db.js";
import { pagination, paginateData } from '../utils/pagination.js';

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @returns 
 */
const listDokter = async (req, res) => {
    const { page = 0, size = 10, sortBy = "dokNama", sort = "ASC" } = req.query;
    const { limit, offset } = pagination(page, size);
    try {
        const queryData = DB_APP.query(
            `SELECT * FROM ms_dokter md WHERE md.dokNama != '' AND md.dokAlamat != ''
            ORDER BY ${sortBy} ${sort}
            LIMIT ${offset}, ${limit}`,
            {
                type: QueryTypes.SELECT
            }
        );
        const queryCount = DB_APP.query(
            `SELECT COUNT(md.dokId) AS jumlah FROM ms_dokter md`,
            {
                type: QueryTypes.SELECT
            }
        );
        const [data, { 0: total }] = await Promise.all([queryData, queryCount]);
        const result = paginateData(data, total.jumlah, page, limit);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Error: ${error.message}` })
    }
};

/**
 * @param {import('express').Request} req - Request object
 * @param {import('express').Response} res - Response object
 */
const addDokter = async (req, res) => {
    const { nama, alamat, jam_praktek } = req.body;
    try {
        if (!nama || typeof nama !== "string") {
            return res.status(400).json({ message: "nama tidak boleh kosong dan harus berupa string" });
        }
        if (!alamat || typeof alamat !== "string") {
            return res.status(400).json({ message: "alamat tidak boleh kosong dan harus berupa string" });
        }
        if (!jam_praktek || typeof jam_praktek !== "string") {
            return res.status(400).json({ message: "jam_praktek tidak boleh kosong dan harus berupa string" });
        }
        const data = await DB_APP.query(`INSERT INTO ms_dokter (dokNama,dokAlamat,dokJamPraktek) VALUES(:nama, :alamat, :jam_praktek)`,
            {
                type: QueryTypes.INSERT,
                replacements: { nama, alamat, jam_praktek }
            }
        );
        return res.status(201).json(
            {
                "message": "Dokter berhasil ditambahkan",
                "dokId": data[0]
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @param {import('express').Request} req - Request object
 * @param {import('express').Response} res - Response object
 */
const editDokter = async (req, res) => {
    const { dokId } = req.params;
    const { nama, alamat, jam_praktek } = req.body;
    try {
        const data = await DB_APP.query(`SELECT * FROM ms_dokter WHERE dokId = :dokId`, {
            type: QueryTypes.SELECT,
            replacements: {dokId}
        });
        if (data.length > 0) {
            await DB_APP.query(`UPDATE ms_dokter SET dokNama = :nama, dokAlamat = :alamat, dokJamPraktek= :jam_praktek WHERE dokId = :dokId`,
                {
                    type: QueryTypes.UPDATE,
                    replacements: { nama, alamat, jam_praktek, dokId }
                }
            );
            return res.status(200).json(
                {
                    "message": "Dokter berhasil ditambahkan",
                }
            );
        } else {
            return res.status(404).json({ message: "Dokter tidak ditemukan" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @param {import('express').Request} req - Request object
 * @param {import('express').Response} res - Response object
 */
const deleteDokter = async (req, res) => {
    const { dokId } = req.params;
    try {
        await DB_APP.query(`DELETE FROM ms_dokter WHERE dokId = :dokId`, { replacements: { dokId }, type: QueryTypes.DELETE });
        return res.status(200).json({ message: "Dokter berhasil dihapus" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export {
    listDokter,
    addDokter,
    editDokter,
    deleteDokter,
}