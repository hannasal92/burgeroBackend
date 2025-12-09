import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";

export function createApp() {
  const app = express();
  
  app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
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