import { defineController } from "./$relay";
import { updateTask, deleteTask } from "@/server/tasks";

export default defineController(() => ({
  patch: async ({ body, params }) => {
    await updateTask(params.taskKey, body);
    return { status: 204 };
  },
  delete: async ({ params }) => {
    await deleteTask(params.taskKey);
    return { status: 204 };
  },
}));
