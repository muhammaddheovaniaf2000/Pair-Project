'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Menjalankan raw query untuk mereset sequence di tabel "Users"
    await queryInterface.sequelize.query(
      `SELECT setval(pg_get_serial_sequence('"Users"', 'id'), (SELECT MAX(id) FROM "Users"));`
    );

    // Menjalankan raw query untuk mereset sequence di tabel "Profiles"
    await queryInterface.sequelize.query(
      `SELECT setval(pg_get_serial_sequence('"Profiles"', 'id'), (SELECT MAX(id) FROM "Profiles"));`
    );
  },

  async down (queryInterface, Sequelize) {
    // Tidak perlu melakukan apa-apa saat down
  }
};