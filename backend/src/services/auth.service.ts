import { Prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

const generateAuthToken = (userId: string) =>
  jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: "1h",
    issuer: env.jwtIssuer,
    audience: env.jwtAudience,
  });

const toSafeUser = (user: { id: string; name: string; email: string }) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

export const registerUserService = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const existingUser = await Prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await Prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });

  const token = generateAuthToken(user.id);

  return {
    token,
    user: toSafeUser(user),
  };
};

export const loginUserService = async (data: {
  email: string;
  password: string;
}) => {
  const user = await Prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = generateAuthToken(user.id);

  return {
    token,
    user: toSafeUser(user),
  };
};
