// TODO(frourio team): Planning to make it module.

import http from "http";
import type { Express } from "express";
import framework from "@vendia/serverless-express/src/frameworks/express";
import ServerlessResponse from "@vendia/serverless-express/src/response";
import { HttpResponse } from "@architect/functions";

// NOTE: Copied from "@vendia/serverless-express/src/transport"
async function waitForStreamComplete(
  stream: http.ServerResponse,
): Promise<http.ServerResponse> {
  if (stream.writableEnded) {
    return stream;
  }

  return new Promise((resolve, reject) => {
    stream.once("error", complete);
    stream.once("end", complete);
    stream.once("finish", complete);

    let isComplete = false;

    function complete(err: Error | undefined) {
      if (isComplete) {
        return;
      }

      isComplete = true;

      stream.removeListener("error", complete);
      stream.removeListener("end", complete);
      stream.removeListener("finish", complete);

      if (err) {
        reject(err);
      } else {
        resolve(stream);
      }
    }
  });
}

export interface ArchitectHttpRequest {
  version: string;
  routeKey: string;
  rawPath: string;
  rawQueryString: string;
  headers: Record<string, string>;
  body: string | undefined;
  requestContext: {
    accountId: string;
    apiId: string;
    domainName: string;
    domainPrefix: string;
    http: {
      method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
      path: string;
      protocol: string;
      sourceIp: string;
      userAgent: string;
    };
    requestId: string;
    routeKey: string;
    stage: string;
    time: string;
    timeEpoch: number;
  };
  pathParameters?: {
    proxy: string;
  };
  isBase64Encoded: boolean;
}

export class BeginIncomingMessage extends http.IncomingMessage {
  constructor(req: ArchitectHttpRequest) {
    const remoteAddress = req.requestContext.http.sourceIp;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    super({
      encrypted: true,
      readable: false,
      remoteAddress,
      address: () => ({ port: 443 }),
      end: Function.prototype,
      destroy: Function.prototype,
    } as any);
    /* eslint-enable */

    const body =
      req.isBase64Encoded && typeof req.body === "string"
        ? Buffer.from(req.body, "base64")
        : req.body;

    Object.assign(this, {
      ip: remoteAddress,
      complete: true,
      httpVersion: "1.1",
      httpVersionMajor: "1",
      httpVersionMinor: "1",
      method: req.requestContext.http.method,
      headers: req.headers,
      body,
      url: `${req.rawPath}${
        req.rawQueryString ? `?${req.rawQueryString}` : ""
      }`,
    });

    this._read = () => {
      this.push(body);
      this.push(null);
    };
  }
}

export const beginExpressHandler = async (
  app: Express,
  req: ArchitectHttpRequest,
): Promise<HttpResponse> => {
  const request = new BeginIncomingMessage(req);
  const response = new ServerlessResponse(request);

  const onData = (chunk: Buffer): void => {
    chunks.push(chunk);
  };
  response.on("data", onData);

  await framework.sendRequest({ app, request, response });
  const chunks: Buffer[] = [];

  await waitForStreamComplete(response);
  response.off("data", onData);

  const arcRes: HttpResponse = {
    statusCode: response.statusCode,
    headers: ServerlessResponse.headers(response),
    body: ServerlessResponse.body(response).toString("base64"),
    isBase64Encoded: true,
  };
  return arcRes;
};
