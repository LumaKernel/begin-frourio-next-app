import jwt from "express-jwt";
import { defineHooks } from "./$relay";
import { API_JWT_SECRET } from "@/server/env";

export type AdditionalRequest = {
  user: {
    id: string;
  };
};

export default defineHooks(() => ({
  onRequest: jwt({ secret: API_JWT_SECRET, algorithms: ["HS256"] }),
}));
