const express = require('express');
const { fetchJavaScriptContent } = require('./controller/fetchController');
const { validateUrl } = require('./validations/appValidations');

const app = express();
const PORT = 3000;

// Handling CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
    if (req.method === "OPTIONS") {
      // Handle preflight requests (sent by browsers before making actual requests)
      res.status(200).end();
    } else {
      next();
    }
  });

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
