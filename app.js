const express = require('express')
const app = express()
const port = 3000
const router = require('./routes')
const session = require('express-session')

// template engine, default folder is 'views'
app.set('view engine', 'ejs')

// Middleware to parse data from html form
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: 'secret-ecommerce-key', // String rahasia, GANTI!
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Gunakan secure: true jika sudah HTTPS
}))
// Middleware to use router
app.use(router)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})