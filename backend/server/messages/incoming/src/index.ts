import { Kafka } from 'kafkajs'
import axios from 'axios'
import { config } from 'dotenv'

config()

const kafka = new Kafka({
    clientId: 'nakama-middleware',
    brokers: [process.env.KAFKA_BROKERS || 'localhost:9093']
})

const consumer = kafka.consumer({ groupId: 'nakama-mid-handler' })

async function run() {
    await consumer.connect()
    await consumer.subscribe({ topic: process.env.KAFKA_TOPIC ?? 'kafka_handler', fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`Mensagem recebida no tópico: ${topic}, na partição ${partition}`)

            const headersJson: { [key: string]: string } = {};
            if (message.headers) {
                for (const [key, value] of Object.entries(message.headers)) {
                    headersJson[key] = value?.toString('utf8') ?? '';
                }
            }

            let messageObj: any = {
                value: message.value?.toString(),
                key: message.key?.toString(),
                headers: headersJson
            }

            let destRpcUrl = process.env.NAKAMA_DEST_RPC_URL ?? 'http://localhost:7350/v2/rpc/kafka_consumer?http_key='
            destRpcUrl += process.env.NAKAMA_HTTP_KEY ?? 'defaulthttpkey'

            console.log('Url de destino:' + destRpcUrl)

            let marshalledObj = JSON.stringify(JSON.stringify(messageObj))

            console.log('Payload:')
            console.info(marshalledObj)

            try {
                let response = await axios.post(destRpcUrl, marshalledObj, { headers: { 'Content-Type': 'text/plain' } });
                console.log(response.data);
            } catch (error: any) {
                console.error("Erro ao fazer a requisição:", error.message);
                if (error.response) {
                    console.error("Detalhes da resposta do erro:", error.response.data);
                }
            }

        }
    })
}

run().catch(console.error)