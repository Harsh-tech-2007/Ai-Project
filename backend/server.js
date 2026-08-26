require('dotenv').config(); // must be first — loads env vars before any other module reads process.env
const app = require('./src/app');
const connectDB = require('./src/config/database');
const config = require("./src/config/config");

connectDB();

// app.get("/",(req, res) => {
//    res.send("hello world")
// })
const PORT = config.PORT || 4000;
app.listen(PORT, () => { 
    console.log(`Server running on http://localhost:${PORT}`); 
});