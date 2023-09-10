import express from "express";
import { authRouter } from "./authentication/auth";
import { bookRouter } from "./book-router";
import { paypalRouter } from "./paypal-router";
import { userRouter } from "./user-router";

export const api = express.Router();

api.use("/auth", authRouter);
api.use("/books", bookRouter);
api.use("/users", userRouter);
api.use("/paypal", paypalRouter);
