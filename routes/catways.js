const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catwayController');
const auth = require('../middlewares/auth');

router.post('/', catwayController.createCatway);
router.get('/', catwayController.getCatways);
router.get('/:id', catwayController.getCatway);
router.put('/:id', catwayController.updateCatway);
router.delete('/:id', catwayController.deleteCatway);

module.exports = router;