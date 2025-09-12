import express from "express";

const router = express();

router.get("/home", (req, res) => {
  res.send("Hello woreld");
});

export default router;
