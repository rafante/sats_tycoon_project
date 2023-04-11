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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const kafka = new kafkajs_1.Kafka({
    clientId: 'nakama-middleware',
    brokers: [process.env.KAFKA_BROKERS || 'localhost:9093']
});
const consumer = kafka.consumer({ groupId: 'nakama-mid-handler' });
function run() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        yield consumer.connect();
        yield consumer.subscribe({ topic: (_a = process.env.KAFKA_TOPIC) !== null && _a !== void 0 ? _a : 'kafka_handler', fromBeginning: true });
        yield consumer.run({
            eachMessage: ({ topic, partition, message }) => __awaiter(this, void 0, void 0, function* () {
                var _b, _c, _d, _e, _f;
                console.log(`Mensagem recebida no tópico: ${topic}, na partição ${partition}`);
                const headersJson = {};
                if (message.headers) {
                    for (const [key, value] of Object.entries(message.headers)) {
                        headersJson[key] = (_b = value === null || value === void 0 ? void 0 : value.toString('utf8')) !== null && _b !== void 0 ? _b : '';
                    }
                }
                let messageObj = {
                    value: (_c = message.value) === null || _c === void 0 ? void 0 : _c.toString(),
                    key: (_d = message.key) === null || _d === void 0 ? void 0 : _d.toString(),
                    headers: headersJson
                };
                let destRpcUrl = (_e = process.env.NAKAMA_DEST_RPC_URL) !== null && _e !== void 0 ? _e : 'http://localhost:7350/v2/rpc/kafka_consumer?http_key=';
                destRpcUrl += (_f = process.env.NAKAMA_HTTP_KEY) !== null && _f !== void 0 ? _f : 'defaulthttpkey';
                console.log('Url de destino:' + destRpcUrl);
                let marshalledObj = JSON.stringify(JSON.stringify(messageObj));
                console.log('Payload:');
                console.info(marshalledObj);
                try {
                    let response = yield axios_1.default.post(destRpcUrl, marshalledObj, { headers: { 'Content-Type': 'text/plain' } });
                    console.log(response.data);
                }
                catch (error) {
                    console.error("Erro ao fazer a requisição:", error.message);
                    if (error.response) {
                        console.error("Detalhes da resposta do erro:", error.response.data);
                    }
                }
            })
        });
    });
}
run().catch(console.error);
