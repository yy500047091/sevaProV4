"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
async function connectDatabase() {
    if (!env_1.env.useMongo || !env_1.env.mongodbUri) {
        console.log('MongoDB disabled. Using in-memory development store.');
        return;
    }
    await mongoose_1.default.connect(env_1.env.mongodbUri);
    console.log('MongoDB connected.');
}
//# sourceMappingURL=database.js.map