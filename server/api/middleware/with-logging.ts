import logger from "@server/logger";
import {pick} from 'lodash';
import { randomUUID } from "crypto";
import { NextApiHandler } from "next";
import { IncomingHttpHeaders } from "http";
import { OutgoingHttpHeaders } from "http2";

export const withLogging = (handler: NextApiHandler) => {
  const handlerWithLogging: NextApiHandler = async (req, res) => {
    const requestId = randomUUID()
    const requestInfo = {
      requestId,
      method: req.method,
      url: req.url,
      requestIp: req.socket.remoteAddress,
      requestHeaders: getHeadersToLog(req.headers),
    }

    logger.info(requestInfo, 'Request received')

    const requestStartTime = Date.now()
    await handler(req, res)
    const requestFinishTime = Date.now()

    const durationInMs = (requestFinishTime - requestStartTime)

    logger.info({
      ...requestInfo,
      status: res.statusCode,
      durationInMs,
      responseHeaders: getHeadersToLog(res.getHeaders())
    }, 'Request handled')
  }

  return handlerWithLogging
}

const getHeadersToLog = (headers: IncomingHttpHeaders | OutgoingHttpHeaders) => {
  return pick(headers, 'referrer', 'content-length', 'content-type', 'user-agent', 'x-forwarded-for')
}