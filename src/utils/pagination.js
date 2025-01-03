const pagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page && page > 0 ? (page-1) * limit : 0;

    return { limit, offset };
};

const paginateData = (datas, total, page, limit) => {
    const totalItems = total;
    const data = datas;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);
    const pageSize = limit;

    return { totalItems, pageSize, totalPages, currentPage, data };
};

export {
    pagination, paginateData
}