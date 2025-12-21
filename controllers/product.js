// controllers/productController.js

const { Product, Category } = require('../models'); 
const { Op } = require('sequelize'); 

class ControllersProduct {
    
    // R - READ: Menampilkan semua produk (Termasuk Search, Sort, Eager Loading)
    static async read(req, res) {
        try {
            const { search, sortBy, msg } = req.query; 
            const role = req.session.role; 

            const options = {
                include: [Category], 
                where: {}
            };

            // SEARCH 
            if (search) {
                options.where.name = { [Op.iLike]: `%${search}%` };
            }

            // SORT
            if (sortBy === 'priceAsc') {
                options.order = [['price', 'ASC']];
            } else if (sortBy === 'priceDesc') {
                options.order = [['price', 'DESC']];
            }

            // Panggil Static Method dari model (memastikan stock > 0)
            const data = await Product.getProductsInStock(options); 
            
            res.render('products', { data, search, sortBy, msg, role });

        } catch (error) {
            console.error(error); 
            res.send(`Terjadi kesalahan saat membaca data produk: ${error.message}`);
        }
    }

    // C - CREATE - 1: Menampilkan Form Tambah Produk (Admin Access)
    static async getAddProduct(req, res) {
        try {
            // Ambil semua kategori untuk dropdown/select form
            const categories = await Category.findAll();
            const errors = req.query.errors ? JSON.parse(req.query.errors) : null;
            
            res.render('addProduct', { categories, errors });
        } catch (error) {
            console.error(error);
            res.send(`Terjadi kesalahan saat menampilkan form tambah produk: ${error.message}`);
        }
    }

    // C - CREATE - 2: Memproses Data Form Tambah Produk (Admin Access)
    static async postAddProduct(req, res) {
        try {
            const { name, description, price, stock, CategoryIds } = req.body;
            
            // 1. Buat Produk Utama
            const newProduct = await Product.create({ name, description, price, stock });
            
            // 2. Tambahkan Relasi Many-to-Many (Category)
            await newProduct.setCategories(CategoryIds);
            
            res.redirect('/products?msg=Produk baru berhasil ditambahkan!');

        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const errors = error.errors.map(err => err.message);
                // Redirect kembali ke form dengan pesan error validasi
                return res.redirect(`/products/add?errors=${JSON.stringify(errors)}`);
            }
            console.error(error);
            res.send(`Terjadi kesalahan saat menyimpan produk baru: ${error.message}`);
        }
    }

    // U - UPDATE - 1: Menampilkan Form Edit Produk (Admin Access)
    static async getEditProduct(req, res) {
        try {
            const { id } = req.params;
            const errors = req.query.errors ? JSON.parse(req.query.errors) : null;
            
            // Eager loading untuk mendapatkan kategori yang sudah dipilih
            const product = await Product.findByPk(id, { include: [Category] });
            const categories = await Category.findAll();

            if (!product) {
                return res.redirect('/products?msg=Produk tidak ditemukan!');
            }

            res.render('editProduct', { product, categories, errors });
        } catch (error) {
            console.error(error);
            res.send(`Terjadi kesalahan saat menampilkan form edit produk: ${error.message}`);
        }
    }

    // U - UPDATE - 2: Memproses Data Form Edit Produk (Admin Access)
    static async postEditProduct(req, res) {
        try {
            const { id } = req.params;
            const { name, description, price, stock, CategoryIds } = req.body;
            
            // 1. Update Produk Utama
            await Product.update(
                { name, description, price, stock }, 
                { where: { id } }
            );

            // 2. Update Relasi Many-to-Many
            const product = await Product.findByPk(id);
            if (product) {
                await product.setCategories(CategoryIds); 
            }
            
            res.redirect('/products?msg=Produk berhasil diperbarui!');
            
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const errors = error.errors.map(err => err.message);
                return res.redirect(`/products/edit/${req.params.id}?errors=${JSON.stringify(errors)}`);
            }
            console.error(error);
            res.send(`Terjadi kesalahan saat memperbarui produk: ${error.message}`);
        }
    }
    
    // D - DELETE: Menghapus produk (Promise Chaining)
    static deleteProduct(req, res) {
        const { id } = req.params;
        
        Product.destroy({ where: { id } })
        .then(result => {
            if (result === 0) {
                 throw new Error(`Produk dengan ID ${id} tidak ditemukan.`);
            }
            res.redirect('/products?msg=Produk berhasil dihapus!'); 
        })
        .catch(error => {
            console.error(error);
            res.redirect(`/products?msg=Gagal menghapus: ${error.message}`);
        });
    }
}

module.exports = ControllersProduct;