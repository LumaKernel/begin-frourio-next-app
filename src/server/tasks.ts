import data from "@begin/data";
import type { Task } from "~/src/types";

const table = "tasks";

export const getTasks = async (
  limit?: number,
): Promise<{ list: Task[]; cursor?: string }> => {
  const result = await data.get({
    table,
    limit,
  });
  return {
    list: [...result],
    cursor: result.cursor,
  };
};

export const createTask = async (label: Task["label"]): Promise<Task> =>
  await data.set({
    table,
    label,
    done: false,
    // TTL is 1 hour. Note that it is not guaranteed to be deleted right after the TTL.
    ttl: Date.now() / 1000 + 60 * 60,
  });

export const updateTask = async (
  key: Task["key"],
  partialTask: Partial<Omit<Task, "key">>,
): Promise<Task> => {
  return await data.set({
    ...(await data.get({ table, key })),
    ...partialTask,
    table,
    key,
  });
};

export const deleteTask = async (key: Task["key"]): Promise<Task> => {
  const old = await data.get({ table, key });
  if (!old) {
    throw new Error(`Task key not found: ${key}`);
  }
  await data.destroy({ table, key });
  return old;
};
