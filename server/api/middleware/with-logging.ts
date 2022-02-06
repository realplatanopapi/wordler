import logger from "@server/logger";
import {pick} from 'lodash';
import { randomUUID } from "crypto";
import { NextApiHandler, NextApiRequest } from "next";
import { IncomingHttpHeaders } from "http";
import { OutgoingHttpHeaders } from "http2";
import rollbar from '@server/services/rollbar';

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
    try {
      await handler(req, res)
    } catch (error) {
      const user = {
        id: getUserIdFromRequest(req)
      }
      const errorExtra = {
        ...req,
        headers: getHeadersToLog(req.headers),
        requestId,
        user
      }

      if (error instanceof Error) {
        logger.error({
          ...error,
          ...errorExtra
        }, `${error.name}: ${error.message}`)
        rollbar.error(error, errorExtra)
        throw error
      } else {
        logger.error(errorExtra, `Unknown error: ${error}`)
        rollbar.error('Unknown error', errorExtra)
        throw error
      }
    }

    const requestFinishTime = Date.now()
    const durationInMs = (requestFinishTime - requestStartTime)

    logger.info({
      ...requestInfo,
      status: res.statusCode,
      durationInMs,
      responseHeaders: getHeadersToLog(res.getHeaders()),
      userId: getUserIdFromRequest(req),
    }, 'Request handled')
  }

  return handlerWithLogging
}

const getHeadersToLog = (headers: IncomingHttpHeaders | OutgoingHttpHeaders) => {
  return pick(headers, 'referrer', 'content-length', 'content-type', 'user-agent', 'x-forwarded-for')
}

const getUserIdFromRequest = (req: NextApiRequest): string | null => {
  return req.session?.userId || null
}