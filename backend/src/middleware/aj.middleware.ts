import { NextFunction, Request, RequestHandler, Response } from "express";
import { aj } from "../lib/arcjet";
import { isSpoofedBot } from "@arcjet/inspect";


export const arcjetProtection: RequestHandler = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);
    console.log("Arcjety decision", decision);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ message: "Rate limit exceeded, Please try again later" });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot access denied" });
      } else {
        return res
          .status(403)
          .json({ message: "Access denied by security policy" });
      }
    }

    //check for spoofed (human like bots) bots
    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        message: "Malicious bot acitivity detected",
        error: "Spoofed bot detection",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went went wrong in the aj middleware" });
  }
};
