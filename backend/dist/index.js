"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const task_route_1 = __importDefault(require("./routes/task.route"));
const error_middleware_1 = require("./middleware/error.middleware");
dotenv_1.default.config();
const env_1 = require("./config/env");
const app = (0, express_1.default)();
app.disable("x-powered-by");
app.use((_, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer");
    next();
});
app.use(express_1.default.json({ limit: "1mb" }));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || env_1.env.clientUrls.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
}));
app.use("/auth", auth_routes_1.default);
app.use("/tasks", task_route_1.default);
app.get("/", (_req, res) => {
    res.send("Hello World!");
});
app.use(error_middleware_1.notFoundMiddleware);
app.use(error_middleware_1.errorMiddleware);
app.listen(env_1.env.port, () => {
    console.log(`Server running on port ${env_1.env.port}`);
});
//# sourceMappingURL=index.js.map