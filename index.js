const express = require("express");
const path = require("path");
const { saveResultToBlob } = require("./storage");

const app = express();
const PORT = 3000;

function fibonacci(n) {
    if (n === 0) return 0;
    if (n === 1) return 1;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}

app.use(express.static("public"));

app.get("/fibonacci", async (req, res) => {
    const n = parseInt(req.query.n);
    if (isNaN(n) || n < 0 || n > 1476) {
        return res.status(400).json({ error: "Oopsie! That input doesn't quite add up, floof. Make sure you give me a number between 0 and 1476 — nothing less, nothing more, just paw-fect! 🐾✨"});
    }

    const result = fibonacci(n);

    try {
        await saveResultToBlob(n, result);
    } catch (err) {
        console.error("Blob error:", err.message);
    }

    res.json({ input: n, result });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
