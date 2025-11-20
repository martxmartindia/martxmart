import cron from "node-cron";
import { AuthToken, EbillAccessToken } from "@/utils/AuthToken";

// Every 24 hours
cron.schedule("0 0 * * *", () => {
  console.log("Running AuthToken job");
  AuthToken();
});

// Every 6 hours
cron.schedule("0 */6 * * *", () => {
  console.log("Running EbillAccessToken job");
  EbillAccessToken();
});
