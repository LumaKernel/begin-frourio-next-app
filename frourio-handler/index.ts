import type { HttpResponse } from "architect__functions";
import server from "~/$server";

import express from "express";
import type { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import { beginExpressHandler } from "~/begin-express-handler";
import type { ArchitectHttpRequest } from "~/begin-express-handler";

const init = (): Express => {
  const app = express();
  app.use(helmet());
  app.use(
    cors({
      origin: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    }),
  );
  const multer =
    process.env.NODE_ENV === "development"
      ? undefined
      : {
          dest: "/tmp/.upload",
        };
  server(app, {
    basePath: "/api",
    multer,
  });
  return app;
};

let app: Express | undefined;

export const handler = async (
  req: ArchitectHttpRequest,
): Promise<HttpResponse> => {
  if (!app) app = init();
  const res = await beginExpressHandler(app, req);
  return res;
};
