import express, { Request } from "express";
import { UserRepo } from "../db/user-model";
import passport from "./authentication/passport";

export const paypalRouter = express.Router();

paypalRouter.put(
  "/update-coins/:userId",
  passport.authenticate("jwt", { session: false }),
  (req: Request<{ userId: number }, {}, { coins: number }, {}>, res) => {
    const coins = req.body.coins;
    const userId = req.params.userId;
    const userRepo = new UserRepo();
    userRepo
      .updateCoins(coins, userId)
      .then((isSuccessful) => {
        if (isSuccessful) {
          return res.status(200).send("Coins successfully updated");
        } else {
          return res.status(500).send("Coins could not be updated");
        }
      })
      .catch((err) => {
        return res.status(500).send(err);
      });
  }
);
