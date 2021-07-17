import { defineController } from "./$relay";
import { getUserInfoById, changeIcon } from "@/server/user";

export default defineController(() => ({
  get: async ({ user }) => ({
    status: 200,
    body: await getUserInfoById(user.id),
  }),
  post: async ({ user, body }) => ({
    status: 201,
    body: await changeIcon(user.id, body.icon),
  }),
}));
