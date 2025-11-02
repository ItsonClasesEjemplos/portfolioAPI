const express = require('express');

const router = express.Router();


router.get('/', async (req, res) => {
try{
    res.json("respuesta");
}catch(err){}
});

router.get('/:id', async (req, res) => {

})

router.post('/', async (req, res) => {

})

router.patch('/:id', async (req, res) => {

})

router.delete('/:id', async (req, res) => {

})

module.exports = router;