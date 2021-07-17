import type { Task } from "@/types";

export type Methods = {
  get: {
    query?: {
      limit?: number;
      message?: string;
    };

    resBody: {
      list: Task[];
      cursor?: string;
    };
  };
  post: {
    reqBody: Pick<Task, "label">;
    resBody: Task;
  };
};
