import cron from "node-cron";
import { scrapeData } from "./scraper.js";

// Schedule to run every hour
cron.schedule("0 * * * *", () => {
  console.log("⏰ Running scheduled scrape:", new Date().toLocaleString());
  scrapeData();
});

// Run immediately as well
scrapeData();
