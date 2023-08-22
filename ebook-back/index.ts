import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import passport from "passport";
import { api } from "./api/api";

const PORT = process.env.PORT || 8000;

const app = express();

app.use(
  session({
    secret: "keyboard dog",
    resave: true,
    saveUninitialized: true,
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
