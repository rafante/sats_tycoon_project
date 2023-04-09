function rpcListLedger(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const ledger: nkruntime.WalletLedgerList = nk.walletLedgerList(ctx.userId)
    logger.info(ledger.toString())
    if (ledger.items.length) {
        logger.info(ledger.toString())
        return JSON.stringify(ledger.items)
    }
    return JSON.stringify({ 'msg': 'Nada ncontrado' })
}

function rpcAddSats(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    logger.info('adicionado mais 1')

    try {
        const results: nkruntime.WalletUpdateResult = nk.walletUpdate(ctx.userId, { sats: 1 }, {}, true)
        return JSON.stringify(results)
    } catch (error) {
        logger.error(`${error}`)
    }
    return JSON.stringify({ 'message': 'Ocorreu um erro' })
}

function rpcGetSats(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    const read = nk.storageRead([
        { collection: 'sats', key: 'balance', userId: ctx.userId }
    ])

    let response = {}

    try {
        let result = nk.storageRead(read)

        if (!result.length) {
            const write = nk.storageWrite([
                { collection: 'sats', key: 'balance', value: { amount: 0 }, userId: ctx.userId }
            ])
            response = { balance: 0 }
        } else {
            response = { balance: result[0]['value']['amount'] }
        }
    } catch (error) {
        logger.error(`${error}`)
    }
    return JSON.stringify(response)
}