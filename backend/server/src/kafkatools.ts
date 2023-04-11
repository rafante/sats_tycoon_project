function rpcKafkaConsumer(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    let message = JSON.parse(payload)
    message['resposta'] = 'ok!'

    logger.info(JSON.stringify(message))
    return JSON.stringify(message)
}