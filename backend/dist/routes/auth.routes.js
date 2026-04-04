"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const async_handler_1 = require("../utils/async-handler");
const router = (0, express_1.Router)();
router.post("/register", (0, async_handler_1.asyncHandler)(auth_controller_1.registerUser));
router.post("/login", (0, async_handler_1.asyncHandler)(auth_controller_1.loginUser));
router.post("/refresh", (0, async_handler_1.asyncHandler)(auth_controller_1.refreshToken));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map