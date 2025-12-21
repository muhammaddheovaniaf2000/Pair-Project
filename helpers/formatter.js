// helpers/formatter.js

class Formatter {
    // Static method untuk memformat alamat menjadi huruf kapital
    static formatAddress(address) {
        if (!address) return '';
        return address.toUpperCase();
    }
    
    // Static method lain (contoh: format date)
    static formatDate(date) {
        if (!date) return 'N/A';
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

module.exports = Formatter;