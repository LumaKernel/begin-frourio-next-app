// TODO(frourio team): Planning to contribute them to proper projects.
declare module "@begin/data" {
  // NOTE(LICENSE): Documentation text is brought from official documents.
  export type BeginDataType =
    | number
    | string
    | boolean
    | null
    | Array<BeginDataType>
    | Record<string, BeginDataType>;
  export type DataGetSingle = {
    table: string;
    key: string;
  };
  export type DataGetMultiple = Array<DataGetSingle>;
  export type DataGetEntireTable = {
    table: string;
    limit?: number;
    /**
     * If your table contains many documents (or a greater number of documents than your limit), it will return a cursor
     */
    cursor?: string;
  };
  export type DataGetSingleResult = {
    table: string;
    key: string;
    [others: key]: BeginDataType;
  } | null;
  export type DataGetSingleCallback = (result: DataGetSingleResult) => void;
  export type DataGetMultipleResult = Array<{
    table: string;
    key: string;
    [others: key]: BeginDataType;
  }>;
  export type DataGetMultipleCallback = (result: DataGetMultipleResult) => void;
  export type DataGetEntireTableResult = DataGetMultipleResult & {
    cursor?: string;
  };
  export type DataGetEntireTableCallback = (
    result: DataGetEntireTableResult,
  ) => void;

  export type DataSetSingle = {
    table: string;
    /**
     * If no key is supplied, Begin Data will automatically supply a pseudo-random, unique, immutable key
     */
    key?: string;
    /**
     * Any document can be automatically expunged by setting a ttl value.
     *
     * ttl is a Number corresponding to a specific future Unix epoch (expressed in seconds).
     *
     * Documents will typically be automatically destroyed within 48 hours of the ttl expiring.
     *
     * Tip: during the intervening time between ttl expiry and actual expunging, the document will still be available; if its ttl is mutated or unset, the document's new ttl state will be respected.
     */
    ttl?: number;
    [others: string]: BeginDataType;
  };
  export type DataSetMultiple = Array<DataSetSingle>;
  export type DataSetResult = {
    table: string;
    key: string;
  };
  export type DataSetCallback = () => DataSetResult;

  export type DataDestroySingle = {
    table: string;
    key: string;
  };
  export type DataDestroyMultiple = Array<DataDestroySingle>;
  export type DataDestroyCallback = () => void;

  export type DataCountParams = {
    table: string;
  };
  export type DataCountCallback = () => void;

  export type DataIncrementParams = {
    table: string;
    key: string;
    prop: string;
  };
  export type DataIncrementCallback = () => void;

  export type DataDecrementParams = {
    table: string;
    key: string;
    prop: string;
  };
  export type DataDecrementCallback = () => void;

  /**
   * @see https://docs.begin.com/en/data/begin-data
   */
  export interface BeginData {
    /**
     * As you'd imagine, data.get() is responsible for getting documents.
     *
     * data.get() can get a single document, batch get multiple documents, or get an entire table.
     */
    get(params: DataGetSingle): Promise<DataGetSingleResult>;
    get(params: DataGetSingle, callback: DataGetSingleCallback): void;
    get(params: DataGetMultiple): Promise<DataGetMultipleResult>;
    get(params: DataGetMultiple, callback: DataGetMultipleCallback): void;
    get(params: DataGetEntireTable): Promise<DataGetEntireTableResult>;
    get(params: DataGetEntireTable, params: DataGetEntireTableCallback): void;

    /**
     * data.set() is responsible for creating new documents, and updating existing ones.
     *
     * data.set() can operate on a single document, or batch up to 25 documents.
     *
     * A single data.set() request cannot exceed 10KB.
     *
     * Your supplied data can be any quantity of the following supported types:
     *   - Number
     *   - String
     *   - Binary (Must be base64 encoded)
     *   - Boolean
     *   - Null
     *   - Array
     *   - Object
     *
     * Limits:
     *   - data.set() has a maximum batch size of 25 documents and 10KB per call.
     *   - Empty attributes are invalid and will produce errors.
     */
    set(params: DataSetSingle | DataSetMultiple): Promise<DataSetResult>;
    set(
      params: DataSetSingle | DataSetMultiple,
      callback: DataSetCallback,
    ): void;

    /**
     * data.destroy() is responsible for destroying documents.
     *
     * Valid data.destroy() calls require passing a one or more objects containing a table and key; there is no limit to the number of documents a single call can destroy.
     */
    destroy(
      params: DataDestroySingle | DataDestroyMultiple,
    ): Promise<Parameters<DataDestroyCallback>>;
    destroy(
      params: DataDestroySingle | DataDestroyMultiple,
      callback: DataDestroyCallback,
    ): void;

    /**
     * data.count() returns the count of a table's documents.
     */
    count(params: DataCountParams): Promise<Parameters<DataCountCallback>>;
    count(params: DataCountParams, callback: DataCountCallback): void;

    /**
     * data.incr() increments the number property.
     */
    incr(
      params: DataIncrementParams,
    ): Promise<Parameters<DataIncrementCallback>>;
    incr(params: DataIncrementParams, callback: DataIncrementCallback): void;

    /**
     * data.decr() decrements the number property.
     */
    incr(
      params: DataDecrementParams,
    ): Promise<Parameters<DataDecrementCallback>>;
    incr(params: DataDecrementParams, callback: DataDecrementCallback): void;
  }
  const data: BeginData;
  export default data;
}

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

declare module "@vendia/serverless-express/src/transport" {
  export function getRequestResponse(request: {
    method: string;
    headers: Record<string, string>;
    body: string;
    remoteAddress: string;
    path: string;
  });
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
  export function waitForStreamComplete(response: http.ServerResponse);
}
