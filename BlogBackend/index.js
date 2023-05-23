require("dotenv").config()
const connectToMongo = require('./db')
const express = require("express")
const cors = require("cors");
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const blogRoutes = require('./routes/blog')


connectToMongo();
const app = express();
const port = process.env.PORT;
app.use(express.static("upload"));


app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/blogs", blogRoutes);

app.get("/", (req, res) => {
    res.send("api is running");
});


app.listen(port, () => {
    console.log(`Example app listening on port  http://localhost:${port}`)
})
