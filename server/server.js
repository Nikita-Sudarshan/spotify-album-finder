import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Spotify API credentials
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Token storage
let accessToken = "";
let tokenExpires = 0;

// Get Spotify access token
async function getAccessToken() {
  const now = Date.now();
  if (accessToken && now < tokenExpires) return accessToken;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  accessToken = data.access_token;
  tokenExpires = now + data.expires_in * 1000;
  return accessToken;
}

// Spotify search API
app.get("/api/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ items: [] });

  try {
    const token = await getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=album&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    res.json(data.albums || { items: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ items: [] });
  }
});

// Serve React frontend
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
