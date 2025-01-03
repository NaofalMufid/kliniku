import { QueryTypes } from "sequelize";
import { DB_APP } from "../config/db.js";
import { paginateData, pagination } from "../utils/pagination.js";

/**
 * 
 * @param {import('express').Request} req - Request object
 * @param {import('express').Response} res - Response object
 */
const listPeriksaLab = async (req, res) => {
    const { page = 0, size = 10, sortBy = "created_at", sort = "ASC" } = req.query;
    const { limit, offset } = pagination(page, size);
    try {
        const queryData = DB_APP.query(
            `SELECT * FROM ms_periksalab
            ORDER BY ${sortBy} ${sort}
            LIMIT ${offset}, ${limit}`,
            {
                type: QueryTypes.SELECT
            }
        );
        const queryCount = DB_APP.query(
            `SELECT COUNT(id) AS jumlah FROM ms_periksalab`,
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

export {
    listPeriksaLab,
}