const router = require('express').Router()
const {signup,login,verifyEmail,verifyToken: verifyTokenApi,fcmToken} = require('../controllers/UserController')
const verifyToken = require('../middlewares/UserMiddleware')
const fileUpload = require('../middlewares/CertificateMiddleware')

router.post('/signup',fileUpload, signup);
router.post('/login', login);
router.get('/verify-email',verifyEmail);
router.get('/verify-token',verifyTokenApi)
router.get('/update-fcm',verifyToken,fcmToken)
module.exports = router;