import { exec } from "child_process";
import { EventEmitter } from "events";
import type { My5GSpeedTest, SpeedTest } from "../../types/services";
import "../utils/env";

export async function runSpeedTest(): Promise<My5GSpeedTest> {
  const command: string = process.env.SPEEDTEST_PATH || "speedtest";
  const args: string[] = ["--format=json-pretty", "--progress=no"];

  const finished = new EventEmitter();

  console.log("Running...", command, args);

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

    speedtest.on("exit", (code, signal) => {
      console.log("EXIT:", code, signal);
    });

    speedtest.on("close", (code) => {
      console.log("CLOSE:", code, stdout, stderr);
      let result: My5GSpeedTest = {
        code: code,
        error: undefined,
        download: undefined,
        upload: undefined,
        latency: undefined,
      };

      if (code != 0) {
        result.error = stderr;
      }

      if (code == 0) {
        const testResult: SpeedTest = JSON.parse(stdout);
        // TODO: store for later inspection

        result.download = testResult.download.bandwidth / 100000;
        result.upload = testResult.upload.bandwidth / 100000;
        result.latency = testResult.ping.latency;
      }

      finished.emit("test_finished", result);
    });
  } catch (error) {
    console.log("ERROR:", error);
  }

  return await new Promise((resolve) => {
    finished.on("test_finished", resolve);
  });
}
