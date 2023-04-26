export interface ScheduledTest {
  time?: Date;
  result?: My5GSpeedTest;
}

export interface SpeedTest {
  type: string;
  timestamp: string;
  ping: {
    jitter: number;
    latency: number;
  };
  download: {
    bandwidth: number;
    bytes: number;
    elapsed: number;
  };
  upload: {
    bandwidth: number;
    bytes: number;
    elapsed: number;
  };
  packageLoss: number;
  isp: string;
  interface: {
    internalIp: string;
    name: string;
    maccAddr: string;
    isVpn: boolean;
    externalIp: string;
  };
  server: {
    id: number;
    host: string;
    port: number;
    name: string;
    location: string;
    country: string;
    ip: string;
  };
  result: {
    id: string;
    url: string;
    persisted: boolean;
  };
}

export type My5GSpeedTest = {
  code: number | null;
  error?: string;
  download?: number;
  upload?: number;
  latency?: number;
};
