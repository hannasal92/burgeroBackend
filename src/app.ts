import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL
];

export function createApp() {
  const app = express();
  
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true); // ✅ allow
    } else {
      callback(new Error("Not allowed by CORS")); // ❌ block
    }
  },
  credentials: true,
}));

  app.use(express.json());
  app.use(cookieParser());
  app.use(helmet());
  app.use(rateLimit({windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10),
                      max: parseInt(process.env.RATE_LIMIT_MAX || "60", 10) }));
    app.use((req, res, next) => {
      req.body = mongoSanitize.sanitize(req.body);
      req.params = mongoSanitize.sanitize(req.params);
      next();
    });

  app.use(routes);

  return app;
}