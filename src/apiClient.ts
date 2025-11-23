import { APIRequestContext } from "@playwright/test";

export class ApiClient {
  constructor(private ctx: APIRequestContext) {}

  async login(username = "user", password = "pass") {
    const res = await this.ctx.post("/auth/login", {
      data: { username, password },
    });
    return { status: res.status(), body: await res.json() };
  }

  async createClaim(token: string, payload: any) {
    const res = await this.ctx.post("/claims", {
      data: payload,
      headers: { Authorization: `Bearer ${token}` },
    });
    return { status: res.status(), body: await res.json() };
  }

  async getClaim(token: string, id: string) {
    const res = await this.ctx.get(`/claims/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { status: res.status(), body: await res.json() };
  }

  async patchClaim(token: string, id: string, data: any) {
    const res = await this.ctx.patch(`/claims/${id}`, {
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
    return { status: res.status(), body: await res.json() };
  }

  async listClaims(token: string, query?: Record<string, any>) {
    const qs = query
      ? "?" +
        new URLSearchParams(
          Object.entries(query).map(([k, v]) => [k, String(v)])
        ).toString()
      : "";

    const res = await this.ctx.get(`/claims${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      status: res.status(),
      body: await res.json(),
      headers: res.headers(),
    };
  }
}
