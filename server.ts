import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

import { applySecurityHeaders, sanitizeRequestMiddleware, rateLimiter } from "./src/server/middleware/security";
import authRouter from "./src/server/routes/auth";
import restaurantsRouter from "./src/server/routes/restaurants";
import productsRouter from "./src/server/routes/products";
import ordersRouter from "./src/server/routes/orders";
import adminRouter from "./src/server/routes/admin";
import reviewsRouter from "./src/server/routes/reviews";
import favoritesRouter from "./src/server/routes/favorites";
import telegramRouter from "./src/server/routes/telegram";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser with size limits against DoS attacks
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Enterprise Security Middlewares
app.use(applySecurityHeaders);
app.use(sanitizeRequestMiddleware);
app.use("/api", rateLimiter(120, 60 * 1000)); // Rate limit 120 reqs/min per IP across APIs

// Initialize Gemini AI client lazily
let genAI: GoogleGenAI | null = null;
function getGenAIClient(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAI;
}

// Health Check Endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "menuz Enterprise Private API Platform",
    security: "Enforced XSS, SQLi & RateLimiting Protection",
    time: new Date().toISOString()
  });
});

// Mount Private Enterprise Modular API Routes
app.use("/api/auth", authRouter);
app.use("/api/restaurants", restaurantsRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/admin", adminRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/telegram", telegramRouter);

// AI Customer Support & Dish Assistant API
app.post("/api/ai-chat", async (req, res) => {
  try {
    const { message, lang = "ar" } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const aiClient = getGenAIClient();
    if (!aiClient) {
      const fallbackResponses: Record<string, string> = {
        ar: "مرحباً بك في مطعم القصر! يسعدنا إجابة استفسارك. هل تحب الاطلاع على توصيات الشيف أم حجز طاولة؟",
        en: "Welcome to The Palace Restaurant! We'd love to help. Would you like to view chef recommendations or book a table?",
        fr: "Bienvenue au restaurant The Palace ! Comment pouvons-nous vous aider aujourd'hui ?"
      };
      return res.json({ reply: fallbackResponses[lang] || fallbackResponses.ar });
    }

    const systemPrompt = `
You are the polite, welcoming AI Customer Support & Culinary Assistant for "menuz - مطعم و كافيه القصر".
Answer user questions concisely and helpfully in language: ${lang}.
Information about restaurant:
- Branches: Riyadh (Olaya), Jeddah (Corniche), Dammam (Beach Rd).
- Currency: SAR (ر.س).
- Top Dishes: Royal Naimi Lamb Kabsa (98 SAR), Palace Mixed Grill 1kg (180 SAR), Angus Ribeye Steak (145 SAR), Creamy Kunafa (36 SAR).
- Services: Digital QR menu, table ordering, payment via Apple Pay/Mada/Cash, table reservations, direct support.
User message: ${message}
`;

    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: systemPrompt,
    });

    const reply = response.text || "مرحباً بك! كيف يمكننا خدمتك اليوم؟";
    res.json({ reply });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to process chat", details: error?.message });
  }
});

async function startServer() {
  // Vite middleware for dev or static serving in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`menuz dev server running on http://localhost:${PORT}`);
  });
}

export default app;

if (process.env.VERCEL !== "1") {
  startServer();
}
