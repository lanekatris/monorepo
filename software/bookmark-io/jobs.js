"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finishJob = exports.startJob = void 0;
const { Client } = require('pg');
function startJob(appName = 'Rhinofit Recent Users') {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Starting job...');
        const client = new Client({
            ssl: true
        });
        yield client.connect();
        const result = yield client.query('INSERT INTO job (name) VALUES ($1) RETURNING *', [appName]);
        yield client.end();
        console.log(`Job ${result.rows[0].id} started.`);
        return result.rows[0];
    });
}
exports.startJob = startJob;
function finishJob(id) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Finishing job...');
        const client = new Client({
            ssl: true
        });
        yield client.connect();
        yield client.query('update job set finished = now() where id = $1', [id]);
        yield client.end();
        console.log(`Job ${id} finished.`);
    });
}
exports.finishJob = finishJob;
