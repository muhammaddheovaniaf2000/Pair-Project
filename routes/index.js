const express = require('express');
const router = express.Router();

// Import Controller
const AuthController = require('../controllers/authController'); 
const OrderController = require('../controllers/orderController');
const ProfileController = require('../controllers/profileController'); // <-- Diperlukan untuk /profile & /admin/dashboard

// Import Middleware
const { isLoggedIn, isAdmin } = require('../middlewares/auth'); // <-- PASTIKAN JALUR INI BENAR (../middlewares/auth)

// Import Product Router
const productRouter = require('./product');

// =======================================================
// A. ROUTE UTAMA & AUTHENTIKASI
// =======================================================

// GET / (Landing Page)
router.get('/', (req, res) => {
    // Anda mungkin ingin mengirimkan data session/role ke landing page juga
    const role = req.session.role; 
    res.render('landing', { role }); // views/landing.ejs
}); 

// Route Login
router.get('/login', AuthController.getLogin);
router.post('/login', AuthController.postLogin);
router.get('/logout', AuthController.logout);

// Route Register
router.get('/register', AuthController.getRegister);
router.post('/register', AuthController.postRegister);


// =======================================================
// B. ROUTE PROTECTED (PROFILE & ORDER)
// =======================================================

// Route Profile (Bisa diakses Customer/Admin yang sudah login)
router.get('/profile', isLoggedIn, ProfileController.showProfile);

// Route Admin Dashboard (HANYA Admin yang bisa akses)
router.get('/admin/dashboard', isLoggedIn, isAdmin, ProfileController.showProfile); // Menggunakan Controller Profile

// Route Order (Hanya bisa diakses jika sudah login)
// Asumsi OrderController.showOrderDetails akan menampilkan riwayat order user yang sedang login
router.get('/orders', isLoggedIn, OrderController.showOrderDetails); 


// =======================================================
// C. PRODUCT ROUTER (Delegasi ke routes/product.js)
// =======================================================
router.use('/products', productRouter);


module.exports = router;