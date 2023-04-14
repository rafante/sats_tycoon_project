import express, { Request, Response } from 'express';
import { Kafka } from 'kafkajs';
import { config } from 'dotenv'

config()

const app = express();
const port = process.env.PORT || 3000;

// Configurar o middleware para analisar o JSON
app.use(express.json());

// Conectar ao Kafka
const kafka = new Kafka({
    clientId: 'nakama-middleware-outgoing',
    brokers: [process.env.KAFKA_BROKERS || 'localhost:9093'], // Altere para o endereço do(s) broker(s) do Kafka
});
const producer = kafka.producer();

app.post('/send_message', async (req: Request, res: Response) => {
    const { topic, message } = req.body;
    try {
        // Conectar o produtor
        await producer.connect();

        // Enviar a mensagem para o tópico especificado
        await producer.send({
            topic,
            messages: [
                {
                    value: JSON.stringify(message),
                },
            ],
        });

        // Desconectar o produtor
        await producer.disconnect();

        res.status(200).json({ status: 'success', message: 'Mensagem enviada com sucesso' });
    } catch (error) {
        console.error('Erro ao enviar mensagem para o Kafka:', error);
        res.status(500).json({ status: 'error', message: 'Erro ao enviar mensagem para o Kafka' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
