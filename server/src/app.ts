import express, {Application, Request, Response} from "express";

import authRoutes from "./routes/auth.routes";

import { errorHandler } from "./middleware/errorHandler";

const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    message: "VyuKarya API is running",
  });
});

app.use(errorHandler)

export default app;