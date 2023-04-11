function InitModule(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, initializer: nkruntime.Initializer) {
    initializer.registerRpc('healthcheck', rpcHealthCheck)
    initializer.registerRpc('getSats', rpcGetSats)
    initializer.registerRpc('addSats', rpcAddSats)
    initializer.registerRpc('listLedger', rpcListLedger)
    initializer.registerRpc('kafka_consumer', rpcKafkaConsumer)


    let collection: nkruntime.StorageWriteRequest[] = [
        { collection: 'sats', key: 'balance', value: { amount: 0 }, userId: ctx.userId }
    ]

    try {
        nk.storageWrite(collection)
        logger.info('Coleção de saldos de satoshi criada')
    } catch (error) {
        logger.error(`${error}`)
    }
}