import { exec } from "child_process";
import { EventEmitter } from "events";
import type { My5GSpeedTest, SpeedTest } from "../../types/services";
import "../utils/env";

const SPEEDTEST_PATH = process.env.SPEEDTEST_PATH || "speedtest";
const ARGS = ["--format=json-pretty", "--progress=no"];

const TEST_FINISHED_EVENT = "test_finished";

export async function runSpeedTest(): Promise<My5GSpeedTest> {
  const finishedEvent = new EventEmitter();

  executeCommand(SPEEDTEST_PATH, ARGS, finishedEvent);

  return await new Promise((resolve) => {
    finishedEvent.on(TEST_FINISHED_EVENT, resolve);
  });
}

function executeCommand(
  command: string,
  args: string[],
  finishedEvent: EventEmitter
) {
  const result: My5GSpeedTest = {
    code: null,
  };

  try {
    const speedtest = exec(`${command} ${args.join(" ")}`);
    let stdout = "";
    let stderr = "";

    speedtest.stdout?.on("data", (data) => {
      stdout += data.toString();
    });

    speedtest.stderr?.on("data", (data) => {
      stderr += data.toString();
    });

    speedtest.on("error", (error) => {
      console.error("ERROR:", error.message);
    });

    speedtest.on("close", (code) => {
      if (code != 0) {
        result.error = stderr;
        result.code = code;
        console.error("Result:", result);
        finishedEvent.emit(TEST_FINISHED_EVENT, result);
        return;
      }

      const testResult: SpeedTest = JSON.parse(stdout);
      // TODO: store for later inspection

      result.download = testResult.download.bandwidth / 100000;
      result.upload = testResult.upload.bandwidth / 100000;
      result.latency = testResult.ping.latency;

      console.error("Result:", result);
      finishedEvent.emit(TEST_FINISHED_EVENT, result);
    });
  } catch (error) {
    result.error = (error as Error).toString();
    console.error("Result:", result);
    finishedEvent.emit(TEST_FINISHED_EVENT, result);
  }
}
