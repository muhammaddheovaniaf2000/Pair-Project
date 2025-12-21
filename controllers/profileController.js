// controllers/profileController.js
const { User, Profile } = require('../models');

class ProfileController {
    static async showProfile(req, res) {
        try {
            const UserId = req.session.UserId; // Ambil ID dari session

            // Eager Loading: Ambil data User, sekalian Profile-nya
            const user = await User.findByPk(UserId, {
                include: [Profile]
            });
            
            if (!user) {
                // Seharusnya tidak terjadi jika isLoggedIn sudah berjalan
                return res.redirect('/login?error=Data pengguna tidak ditemukan.');
            }

            // Kirim data User, Profile, dan Role ke EJS
            res.render('profile', {
                user,
                profile: user.Profile, // Data Profile
                role: req.session.role // Role dari session
            });

        } catch (error) {
            console.error(error);
            res.send(`Terjadi kesalahan saat menampilkan profile: ${error.message}`);
        }
    }
    
    // Anda bisa tambahkan static editProfile(req, res) di sini jika perlu fitur edit
}

module.exports = ProfileController;