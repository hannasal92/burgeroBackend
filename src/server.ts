import dotenv from "dotenv";
dotenv.config();
import { createApp } from "./app";
import { connectDB } from "./config/db";

const PORT = parseInt(process.env.PORT || "3000", 10);


async function main() {
  await connectDB();
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});