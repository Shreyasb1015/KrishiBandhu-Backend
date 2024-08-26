const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/UserMiddleware')
const upload = require('../middlewares/AppointmentMiddleware');
const {
    add,
    get,
    delete: deleteAppointment,
    schedule
} = require('../controllers/AppointmentController');

router.post('/add', verifyToken,upload.array('issueImages', 5), add);

router.get('/get',verifyToken, get);

router.delete('/delete',verifyToken, deleteAppointment);

router.post('/schedule',verifyToken, schedule);

module.exports = router;
