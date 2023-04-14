const afterAuth: nkruntime.AfterHookFunction<nkruntime.Session, nkruntime.AuthenticateEmailRequest> = (ctx, logger: nkruntime.Logger, nk, data) => {
    let payload = {
        'topic': 'auth',
        'message': data
    }
    let payloadStr = JSON.stringify(payload)
    logger.warn('[Enviando]:' + payloadStr)

    try {
        let res: nkruntime.HttpResponse = nk.httpRequest('http://outgoing-messages:3000/send_message', 'post', { "Content-Type": "application/json" }, payloadStr)
        logger.warn(res.code.toString())
        logger.warn(res.body)
        logger.warn(JSON.stringify(res.headers))
    } catch (error) {
        logger.error(`${error}`)
    }
}