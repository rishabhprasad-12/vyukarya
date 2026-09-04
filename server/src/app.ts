import express from "express";

const app = express();

app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.json({
        message: "VyuKarya API is running",
    })
})

export default app;