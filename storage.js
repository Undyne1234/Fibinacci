const { BlobServiceClient } = require("@azure/storage-blob");
require("dotenv").config();

const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
const containerClient = blobServiceClient.getContainerClient("fibonacci-results");

async function saveResultToBlob(n, result) {
    await containerClient.createIfNotExists();
    const blobName = `fib_${n}.json`;
    const blobClient = containerClient.getBlockBlobClient(blobName);
    const content = JSON.stringify({ input: n, result });
    await blobClient.upload(content, Buffer.byteLength(content), { overwrite: true });
}

module.exports = { saveResultToBlob };
