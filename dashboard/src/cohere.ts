import Cohere from "cohere-js";
import config from "./config";

/**
 * @description Init cohere package
 * @return {void}
 */
export function initCohere(): void {
  config.COHERE_API_KEY && Cohere.init(config.COHERE_API_KEY);
}

export function enrichCohereUserData(user: any) {
  if (user) {
    config.COHERE_API_KEY && Cohere.identify(
      user.email, // Required: can be any unique ID
      {
        displayName: user.name,
        email: user.email,
      }
    );
  }
}