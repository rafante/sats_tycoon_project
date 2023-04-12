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
const express_1 = __importDefault(require("express"));
const kafkajs_1 = require("kafkajs");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Configurar o middleware para analisar o JSON
app.use(express_1.default.json());
// Conectar ao Kafka
const kafka = new kafkajs_1.Kafka({
    clientId: 'nakama-middleware-outgoing',
    brokers: [process.env.KAFKA_BROKERS || 'localhost:9093'], // Altere para o endereço do(s) broker(s) do Kafka
});
const producer = kafka.producer();
app.post('/send_message', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { topic, message } = req.body;
    try {
        // Conectar o produtor
        yield producer.connect();
        // Enviar a mensagem para o tópico especificado
        yield producer.send({
            topic,
            messages: [
                {
                    value: JSON.stringify(message),
                },
            ],
        });
        // Desconectar o produtor
        yield producer.disconnect();
        res.status(200).json({ status: 'success', message: 'Mensagem enviada com sucesso' });
    }
    catch (error) {
        console.error('Erro ao enviar mensagem para o Kafka:', error);
        res.status(500).json({ status: 'error', message: 'Erro ao enviar mensagem para o Kafka' });
    }
}));
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
