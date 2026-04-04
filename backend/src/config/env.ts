const required = ["DATABASE_URL", "JWT_SECRET"] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  clientUrls: (process.env.CLIENT_URLS ?? process.env.CLIENT_URL ?? "http://localhost:3001")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  jwtSecret: process.env.JWT_SECRET as string,
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET ?? `${process.env.JWT_SECRET as string}-refresh`,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
  jwtIssuer: process.env.JWT_ISSUER ?? "task-management-api",
  jwtAudience: process.env.JWT_AUDIENCE ?? "task-management-client",
};
