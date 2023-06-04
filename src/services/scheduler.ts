import { EventEmitter } from "events";
import * as Schedule from "node-schedule";
import type { ScheduledTest } from "../../types/services";
import "../utils/env";
import { runSpeedTest } from "./speedtest";

export const MIN_DOWNLOAD_THRESHOLD =
  process.env.MIN_DOWNLOAD_THRESHOLD || "50"; // Mbps
// const MIN_UPLOAD_THRESHOLD = 10     // Mbps
export const SCHEDULED_TEST_FINISHED = "scheduled_test_finished";

export function scheduleSpeedTest(
  scheduledResult: ScheduledTest,
  finishTestEvent: EventEmitter,
  cron: string
) {
  Schedule.scheduleJob(cron, async function (fireTime) {
    scheduledResult.time = fireTime;
    scheduledResult.result = await runSpeedTest();

    finishTestEvent.emit(SCHEDULED_TEST_FINISHED);
  });
}
