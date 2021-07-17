import jwt from "jsonwebtoken";
import { defineController } from "./$relay";
import { validateUser } from "@/server/user";
import { API_JWT_SECRET } from "@/server/env";

export default defineController(() => ({
  post: ({ body }) =>
    validateUser(body.id, body.pass)
      ? {
          status: 201,
          body: { token: jwt.sign({ id: body.id }, API_JWT_SECRET) },
        }
      : { status: 401 },
}));
