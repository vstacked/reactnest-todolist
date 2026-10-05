import axiosBackendClient, { axiosBaseUrl } from "../axios/axios-client";
import { TaskApi } from "./generated";

export const tasksApi = new TaskApi(
  {
    basePath: axiosBaseUrl,
    isJsonMime: () => false,
  },
  undefined,
  axiosBackendClient,
);
