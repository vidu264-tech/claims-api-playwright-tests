import { ApiClient } from "./apiClient";
import { LoginResponseSchema } from "./schemas";
import { validateSchema } from "./utils";

export async function obtainAccessToken(api: ApiClient) {
  const { status, body } = await api.login("user", "pass");
  if (status !== 200) throw new Error("Login failed");

  const { valid, errors } = validateSchema(LoginResponseSchema, body);
  if (!valid) throw new Error(JSON.stringify(errors));

  return body.accessToken;
}
