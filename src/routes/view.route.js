import { Router } from 'express';

const page = Router();

page.get("/coba", async (req, res) => {
    return res.render('layouts/layout', {body: "wkwkw"});
});
page.get("/dokter", async (req, res) => {
    try {
        const response = await fetch('http://localhost:3030/api/dokter');
        const { data } = await response.json();

        return res.render('dokter/index', { dokterList: data });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error loading the page');
    }
});

export default page;