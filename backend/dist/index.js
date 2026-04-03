"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const auth_middleware_1 = require("./middleware/auth.middleware");
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));
app.use('/auth', auth_routes_1.default);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.get('/protected', auth_middleware_1.authMiddleware, (req, res) => {
    res.json({
        message: "You are authenticated",
        user: req.user,
    });
});
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
//# sourceMappingURL=index.js.map