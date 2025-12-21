const express = require('express');
const ProductController = require('../controllers/product'); 
const { isAdmin } = require('../middlewares/auth'); // Asumsi middleware auth sudah dibuat

const router = express.Router();

// A. READ: Melihat daftar produk (Public Access)
router.get('/', ProductController.read); 

// B. CREATE (Tambah Produk) - DILINDUNGI ADMIN
router.get('/add', isAdmin, ProductController.getAddProduct); 
router.post('/add', isAdmin, ProductController.postAddProduct); 

// C. UPDATE (Edit Produk) - DILINDUNGI ADMIN
router.get('/edit/:id', isAdmin, ProductController.getEditProduct); 
router.post('/edit/:id', isAdmin, ProductController.postEditProduct); 

// D. DELETE (Hapus Produk) - DILINDUNGI ADMIN
router.get('/delete/:id', isAdmin, ProductController.deleteProduct); 

module.exports = router;