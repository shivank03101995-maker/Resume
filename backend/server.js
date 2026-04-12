import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "data", "portfolio.json");
const distPath = path.join(__dirname, "..", "frontend", "dist");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/portfolio", async (_req, res) => {
  try {
    const file = await fs.readFile(dataPath, "utf-8");
    res.json(JSON.parse(file));
  } catch (error) {
    res.status(500).json({ message: "Could not load portfolio data." });
  }
});

app.put("/api/portfolio", async (req, res) => {
  try {
    await fs.writeFile(dataPath, JSON.stringify(req.body, null, 2));
    res.json({ message: "Portfolio data updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Could not save portfolio data." });
  }
});

app.use(express.static(distPath));

app.get("*", async (req, res, next) => {
  if (req.path.startsWith("/api")) {
    next();
    return;
  }

  try {
    await fs.access(path.join(distPath, "index.html"));
    res.sendFile(path.join(distPath, "index.html"));
  } catch (error) {
    res.status(404).send("Frontend build not found. Run npm run build first.");
  }
});

app.listen(port, () => {
  console.log(`Portfolio backend running on http://localhost:${port}`);
});
