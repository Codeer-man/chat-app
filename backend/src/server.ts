import express, { Response } from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.routes";
import path from "path";

dotenv.config();

const app = express();

app.use("/api/auth", authRoute);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.resolve(__dirname, "../../frontend/dist");

  app.use(express.static(frontendPath));

  app.get(/.*/, (_, res: Response) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
