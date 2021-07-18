import { API_USER_ID, API_USER_PASS } from "./env";
import type { MulterFile } from "~/$server";
import data from "@begin/data";
import hasha from "hasha";
import type { UserInfo } from "@/types";
import fs from "fs";

const table = "users";

export const validateUser = (key: string, pass: string): boolean =>
  key === API_USER_ID && pass === API_USER_PASS;

export const getUserInfoById = async (key: string): Promise<UserInfo> => {
  const user = await (async () => {
    const tmp = await data.get({
      table,
      key,
    });
    if (!tmp) {
      return await data.set({
        table,
        key,
      });
    }
    return tmp;
  })();
  return user;
};

export const changeIcon = async (
  key: string,
  iconFile: MulterFile,
): Promise<UserInfo> => {
  const hash = await hasha.fromStream(fs.createReadStream(iconFile.path));

  await data.set({
    table: "users",
    key,
    // TODO(user): Please use S3 or something to save icon file...
    iconFileSize: iconFile.size,
    iconFileHash: hash.slice(0, 5),
  });

  await fs.promises.rm(iconFile.path);

  return await getUserInfoById(key);
};
