import express from "express";
import { authRouter } from "./authentication/auth";

export const api = express.Router();

api.use("/auth", authRouter);
