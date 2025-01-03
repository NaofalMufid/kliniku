import { QueryTypes } from "sequelize";
import { DB_APP } from "../config/db.js";
import { pagination, paginateData } from '../utils/pagination.js';

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const riwayatPemeriksaan = async (req, res) => {
    const { 
        page = 0, 
        size = 10, 
        sortBy = "tr.rawatTglPeriksa", 
        sort = "DESC",
        nama_pasien,
        tgl_awal,
        tgl_akhir 
    } = req.query;
    
    const { limit, offset } = pagination(page, size);
    
    let whereClause = '';
    const replacements = {};

    // Filter by patient name
    if (nama_pasien) {
        whereClause += ' WHERE tr.rawatNama LIKE :nama_pasien';
        replacements.nama_pasien = `%${nama_pasien}%`;
    }

    // Filter by date range
    if (tgl_awal && tgl_akhir) {
        whereClause += whereClause ? ' AND' : ' WHERE';
        whereClause += ' tr.rawatTglPeriksa BETWEEN :tgl_awal AND :tgl_akhir';
        replacements.tgl_awal = tgl_awal;
        replacements.tgl_akhir = tgl_akhir;
    }

    try {
        const queryData = DB_APP.query(
            `SELECT 
                tr.id,
                tr.rawatNama as nama_pasien,
                tr.rawatTglPeriksa as tgl_periksa,
                md.dokNama as nama_dokter,
                mp.msPaketNama as nama_pemeriksaan
            FROM tr_rawat tr
            LEFT JOIN tr_rawatlab trl ON tr.id = trl.labRawatId
            LEFT JOIN ms_dokter md ON tr.rawatDokterId = md.dokId
            LEFT JOIN ms_periksalab mp ON trl.labMsId = mp.id
            ${whereClause}
            ORDER BY ${sortBy} ${sort}
            LIMIT ${offset}, ${limit}`,
            {
                type: QueryTypes.SELECT,
                replacements
            }
        );

        const queryCount = DB_APP.query(
            `SELECT COUNT(DISTINCT tr.id) AS jumlah 
            FROM tr_rawat tr
            LEFT JOIN tr_rawatlab trl ON tr.id = trl.labRawatId
            LEFT JOIN ms_dokter md ON tr.rawatDokterId = md.dokId
            LEFT JOIN ms_periksalab mp ON trl.labMsId = mp.id
            ${whereClause}`,
            {
                type: QueryTypes.SELECT,
                replacements
            }
        );

        const [data, { 0: total }] = await Promise.all([queryData, queryCount]);
        const result = paginateData(data, total.jumlah, page, limit);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Error: ${error.message}` });
    }
};

export {
    riwayatPemeriksaan
}
