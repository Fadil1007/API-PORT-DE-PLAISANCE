const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const auth = require('../middlewares/auth');

router.post('/', auth, reservationController.createReservation);
router.get('/', auth, reservationController.getReservations);
router.get('/:id', auth, reservationController.getReservation);
router.delete('/:id', auth, reservationController.deleteReservation);

module.exports = router;