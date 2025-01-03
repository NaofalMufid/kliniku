import { QueryTypes } from "sequelize";
import { DB_APP } from "../config/db.js";
import { pagination, paginateData } from '../utils/pagination.js';

/**
 * @param {import('express').Request} req - Request object
 * @param {import('express').Response} res - Response object
 */
const addPasien = async (req, res) => {
    const { rawatPasId,rawatRm,rawatNama,rawatAlamat,rawatLahir,rawatGender,rawatTglPeriksa,rawatDokterId } = req.body;
    try {
        const newPasien = await DB_APP.query(`
            INSERT INTO tr_rawat (rawatPasId,rawatRm,rawatNama,rawatAlamat,rawatLahir,rawatGender,rawatTglPeriksa,rawatDokterId)
            VALUES (:rawatPasId,:rawatRm,:rawatNama,:rawatAlamat,:rawatLahir,:rawatGender,:rawatTglPeriksa,:rawatDokterId)
        `, 
            { 
                replacements: { rawatPasId,rawatRm,rawatNama,rawatAlamat,rawatLahir,rawatGender,rawatTglPeriksa,rawatDokterId },
                type: QueryTypes.INSERT
            }
        );
        // if (newPasien) {
        //     await DB_APP.query(`
        //         INSERT INTO tr_rawatlab (labRawatId, labMsId, labNoTrans, labTanggal, labDokter) 
        //         VALUES (:msPaketJenis,:msPaketKode,:msPaketNama,:msPaketSlug,:msPaketStatus,:msPaketTarif)
        //     `, 
        //         { replacements: { labRawatId: newPasien[0], labMsId, labNoTrans, labTanggal, labDokter } },
        //         { type: QueryTypes.INSERT }
        //     );
        // }
        return res.status(200).json({ message: "Pasien berhasil didaftarkan", rawatId: newPasien[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const listPasien = async (req, res) => {
    const { page = 0, size = 10, sortBy = "rawatNama", sort = "ASC", tglAwal, tglAkhir, gender } = req.query;
    const { limit, offset } = pagination(page, size);

    let whereClause = '';
    const replacements = {};

    if (tglAwal && tglAkhir) {
        whereClause += ' WHERE tr.rawatTglPeriksa BETWEEN :tglAwal AND :tglAkhir';
        replacements.tglAwal = tglAwal;
        replacements.tglAkhir = tglAkhir;
    }

    if (gender) {
        whereClause += whereClause ? ' AND' : ' WHERE';
        whereClause += ' tr.rawatGender = :gender';
        // Convert L/P to 1/2 for database query
        replacements.gender = gender === 'L' ? 1 : gender === 'P' ? 2 : null;
        
        // Return error if invalid gender provided
        if (replacements.gender === null) {
            return res.status(400).json({ message: "Gender must be 'L' or 'P'" });
        }
    }

    try {
        const queryData = DB_APP.query(
            `SELECT tr.*, md.dokNama 
            FROM tr_rawat tr
            LEFT JOIN ms_dokter md ON tr.rawatDokterId = md.dokId
            ${whereClause}
            ORDER BY ${sortBy} ${sort}
            LIMIT ${offset}, ${limit}`,
            {
                type: QueryTypes.SELECT,
                replacements
            }
        );
        const queryCount = DB_APP.query(
            `SELECT COUNT(tr.id) AS jumlah 
            FROM tr_rawat tr
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
    addPasien,
    listPasien,
}