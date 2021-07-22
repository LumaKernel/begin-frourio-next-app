// TODO(frourio team): Planning to contribute them but not fully typed yet.

declare module "@vendia/serverless-express/src/frameworks/express" {
  import type { Express } from "express";
  import type http from "http";
  export function sendRequest(request: {
    app: Express;
    request: http.IncomingMessage;
    response: http.ServerResponse;
  }): Promise<void>;
}

declare module "@vendia/serverless-express/src/response" {
  import type http from "http";
  class ServerlessResponse extends http.ServerResponse {
    static from(res: http.ServerResponse): ServerlessResponse;
    static body(res: ServerlessResponse): Buffer;
    static headers(res: ServerlessResponse): Record<string, string>;
    get headers(): Record<string, string>;
    constructor(request: http.IncomingMessage);
  }
  export default ServerlessResponse;
}

declare module "@vendia/serverless-express/src/transport" {
  export function getRequestResponse(request: {
    method: string;
    headers: Record<string, string>;
    body: string;
    remoteAddress: string;
    path: string;
  });
}
