export type UserInfo = {
  key: string;
  name?: string;
  // TODO(user): Please use S3 or something to save icon file...
  iconFileSize?: string;
  iconFileHash?: string;
};

export type AuthHeader = {
  authorization: string;
};

export type Task = {
  key: string;
  label?: string;
  done?: boolean;
};
