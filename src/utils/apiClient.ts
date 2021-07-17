import aspida from "@aspida/axios";
import api from "~/api/$api";

export const apiClient =
  process.env.NODE_ENV === "development"
    ? api(
        aspida(undefined, {
          baseURL: "http://localhost:3333/api",
        }),
      )
    : api(
        aspida(undefined, {
          baseURL: "/api",
        }),
      );
