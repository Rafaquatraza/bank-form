require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require("mongoose");
const path = require("path");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const dns = require('dns');
// Force Node to use known public DNS servers for SRV lookups (fixes c-ares ECONNREFUSED on some networks)
dns.setServers(['8.8.8.8', '1.1.1.1']);


const dbURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bankform";
mongoose.connect(dbURI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log("MongoDB Connection Error:", err.message);
});

const formSchema = new mongoose.Schema({
    name: String,
    Branch: String,
    account: String,
    email: String,
    dob: String,
    age: Number,
    gender: String,
    contact: String,
    aadhar: String,
    pan: String,
    address: String,
    income: Number,
    occupation: String,
    education: String,
    nominee: String,
    subscribe: Boolean
});
const Form = mongoose.model("Form", formSchema);
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/submit", async (req, res) => {
    try {
        // Convert checkbox value to boolean
        req.body.subscribe = req.body.subscribe === "on" ? true : false;
        
        const newForm = new Form(req.body);

        await newForm.save();

        console.log(req.body.name, req.body.Branch);

        res.redirect("/success.html");
    } catch (err) {
        console.log("Form Submission Error:", err.message);
        console.log("Full Error:", err);
        res.status(400).send("Error Saving Data: " + err.message);
    }
});

app.post("/another-form", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "anotherform.html"));
});

app.listen(port, () => {
        console.log("Server Running on Port " + port);
});