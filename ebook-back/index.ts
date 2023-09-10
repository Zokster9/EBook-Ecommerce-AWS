import paypal from "@paypal/checkout-server-sdk";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import passport from "passport";
import { api } from "./api/api";

const PORT = process.env.PORT || 8000;

dotenv.config();

const app = express();

const clientId = process.env.PAYPAL_CLIENT_ID!;
const clientSecret = process.env.PAYPAL_SECRET_KEY!;
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
export const client = new paypal.core.PayPalHttpClient(environment);

app.use(
  session({
    secret: process.env.JWTSECRET!,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS", "DELETE", "PUT", "PATCH"],
    allowedHeaders: [
      "X-Requested-With",
      "Origin",
      "Content-Type",
      "Accept",
      "Authorization",
      "Access-Control-Allow-Credentials",
    ],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", api);

app.listen(PORT, () => {
  console.log(`Listening  on port ${PORT}`);
});
