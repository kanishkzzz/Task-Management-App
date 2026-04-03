"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new pg_1.Client({
    connectionString: process.env.DATABASE_URL
});
async function test() {
    try {
        await client.connect();
        console.log("Connected to the database successfully!");
        client.end();
    }
    catch (error) {
        console.log("Error connecting to the database:", error);
    }
}
test();
//# sourceMappingURL=test-db.js.map