const express = require('express');
const { fetchJavaScriptContent } = require('./controller/fetchController');
const { validateUrl } = require('./validations/appValidations');

const app = express();
const PORT = 3000;

// Route for checking server status
app.get("/", (req, res) => {
    res.send("Server is Successfully Running, and App is listening on port " + PORT);
});

// Route for fetching content from a URL
app.get("/fetch", validateUrl, fetchJavaScriptContent);

app.listen(PORT, (error) => {
    if (!error) {
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
    } else {
        console.log("Error occurred, server can't start", error);
    }
});
