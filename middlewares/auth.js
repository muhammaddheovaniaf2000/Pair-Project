// middlewares/auth.js
const isLoggedIn = (req, res, next) => {
    // 1. Cek apakah ada UserId di session
    if (req.session.UserId) {
        next(); // User sudah login, lanjutkan
    } else {
        // Jika belum login, redirect ke halaman login dengan pesan error
        res.redirect('/login?error=Anda harus login untuk mengakses halaman ini.');
    }
};


const isAdmin = (req, res, next) => {
    // 1. Cek apakah ada yang login
    if (!req.session.UserId) {
        return res.redirect('/login?error=Anda harus login untuk mengakses halaman ini.');
    }
    
    // 2. Cek apakah role-nya Admin
    if (req.session.role !== 'admin') {
        // Jika bukan admin, tendang ke halaman produk
        return res.redirect('/products?msg=Anda tidak memiliki hak akses sebagai Admin!');
    }

    // Lanjut ke controller jika lolos
    next();
}

const isCustomer = (req, res, next) => {
    // Logika kebalikan untuk customer (misalnya untuk checkout)
    // ...
    next();
}

module.exports = { isLoggedIn, isAdmin, isCustomer };