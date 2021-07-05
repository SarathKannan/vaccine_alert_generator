import fetch from "node-fetch";
import { logger } from "../@others";

export const get = async (url) => {
  logger([url]);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const respJSON = await response.json();
      return respJSON;
    } else {
      return { error: true };
    }
  } catch (error) {
    return { error: true };
  }
};
