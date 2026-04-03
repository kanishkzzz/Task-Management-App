import { Prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUserService = async (data: {
    name: string,
    email: string,
    password: string,
}) => {
    const existingUser = await Prisma.user.findUnique({
        where: { email: data.email },
    });
    //If User already exists, throw an error
    if (existingUser) {
        throw new Error("User already exists");
    }
    //hash Password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    //Create User
    const user = await Prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
        },
    })

    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
    )
    return { token, user };
};

export const loginUserService = async (data: {
    email: string;
    password: string;
}) => {
    const user = await Prisma.user.findUnique({
        where: { email: data.email },
    });

    if(!user) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if(!isPasswordValid) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
    )
    return { 
        token, 
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        }
    }
}
