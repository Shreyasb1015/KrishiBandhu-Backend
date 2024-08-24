const router = require('express').Router()
const {signup,login,verifyEmail,verifyToken} = require('../controllers/UserController')
const {handlePdfUpload} = require('../middlewares/CertificateMiddleware')

router.post('/signup',handlePdfUpload, signup);
router.post('/login', login);
router.get('/verify-email',verifyEmail);
router.get('/verify-token',verifyToken)
module.exports = router;