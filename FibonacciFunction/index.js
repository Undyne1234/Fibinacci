const { BlobServiceClient } = require("@azure/storage-blob");
require("dotenv").config();

module.exports = async function (context, req) {
    const n = parseInt(req.query.n);
    if (isNaN(n) || n < 0) {
        context.res = {
            status: 400,
            body: { error: "Missing or invalid 'n' parameter" }
        };
        return;
    }

    function fibonacci(n) {
        if (n === 0) return 0;
        if (n === 1) return 1;
        let a = 0, b = 1;
        for (let i = 2; i <= n; i++) {
            [a, b] = [b, a + b];
        }
        return b;
    }

    const result = fibonacci(n);

    try {
        const connStr = process.env.AzureWebJobsStorage;
        const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
        const containerClient = blobServiceClient.getContainerClient("fibonacci-results");
        await containerClient.createIfNotExists();
        const blobClient = containerClient.getBlockBlobClient(`fib_${n}.json`);
        const content = JSON.stringify({ input: n, result });
        await blobClient.upload(content, Buffer.byteLength(content), { overwrite: true });
    } catch (err) {
        context.log("Blob error:", err.message);
    }

    context.res = {
        status: 200,
        body: { input: n, result }
    };
};