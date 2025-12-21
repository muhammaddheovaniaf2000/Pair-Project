// controllers/authController.js
const { User, Profile } = require('../models');
const Formatter = require('../helpers/formatter'); 
const { QueryTypes } = require('sequelize'); 

class AuthController {
    // 1. GET /login
    static async getLogin(req, res) {
        res.render('login', { error: req.query.error });
    }

    // 2. POST /login (ASYNC)
    static async postLogin(req, res) {
        try { // <-- START TRY BLOCK
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });


            if (!user) {
                return res.redirect('/login?error=Email atau Password salah!');
            }

            const isValidPassword = user.checkPassword(password); 

            console.log('HASIL PASSWORD CHECK:', isValidPassword);

            if (isValidPassword) {
                console.log('ROLE DARI DATABASE:', user.role);
                req.session.UserId = user.id;
                req.session.role = user.role; 

                if (user.role === 'admin') {
                    return res.redirect('/admin/dashboard'); // Ganti dengan route admin yang sesuai
                } else {
                    console.log('ROLE DARI DATABASE:', user.role);
                    return res.redirect('/products');
                }
            } else {
                return res.redirect('/login?error=Email atau Password salah!');
            }
        } catch (error) { // <-- START CATCH BLOCK
            console.error(error); // Penting untuk debugging di server
            res.send(`Terjadi kesalahan server saat login: ${error.message}`); 
        }
    }

    // 3. GET /logout
    static logout(req, res) {
        req.session.destroy(err => {
            if (err) return res.send(err);
            res.redirect('/');
        });
    }
    
    // 4. GET /register
    static getRegister(req, res) {
        res.render('register', { errors: null });
    }
    
    // 5. POST /register (ASYNC)
    static async postRegister(req, res) {
        try { // <-- START TRY BLOCK
            const { name, email, password, address } = req.body;
            
            // Menggunakan Helper
            const formattedAddress = Formatter.formatAddress(address); 
            
            // Membuat User (Hook akan menghash password)
            const newUser = await User.create({ 
                email, 
                password, 
                role: 'customer' 
            });
            
            // Membuat Profile
            await Profile.create({
                name,
                address: formattedAddress, 
                UserId: newUser.id
            });

            res.redirect('/login');
        } catch (error) { // <-- START CATCH BLOCK
            // Mengolah Error Validasi Sequelize
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const errors = error.errors.map(err => {
                    return { message: err.message }; 
                });
                return res.render('register', { errors }); // Kirim array error ke views/register.ejs
            } else {
                console.error(error);
                res.send(`Terjadi kesalahan server saat registrasi: ${error.message}`);
            }
        }
    }
}

module.exports = AuthController;