export const LoginResponseSchema = {
  type: "object",
  properties: {
    accessToken: { type: "string" },
    refreshToken: { type: "string" },
    expiresIn: { type: "integer" }
  },
  required: ["accessToken"],
  additionalProperties: false
} as const;

export const ClaimSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    policyNumber: { type: "string" },
    claimantName: { type: "string" },
    damageDate: { type: "string", format: "date" },
    lossDescription: { type: "string" },
    images: { type: "array", items: { type: "string", format: "uri" } },
    status: { type: "string", enum: ["OPEN", "IN_REVIEW", "APPROVED", "PAID"] },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" }
  },
  required: ["id", "policyNumber", "claimantName", "damageDate", "lossDescription", "status", "createdAt", "updatedAt"],
  additionalProperties: false
} as const;

export const ErrorSchema = {
  type: "object",
  properties: {
    code: { type: "string" },
    message: { type: "string" },
    details: { type: ["object", "null"] }
  },
  required: ["code", "message"],
  additionalProperties: false
} as const;
