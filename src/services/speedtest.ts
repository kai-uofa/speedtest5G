import { spawn } from 'child_process';
import { EventEmitter } from 'events';

interface SpeedTest {
    type: string,
    timestamp: string,
    ping: {
        jitter: number,
        latency: number
    },
    download: {
        bandwidth: number,
        bytes: number,
        elapsed: number
    },
    upload: {
        bandwidth: number,
        bytes: number,
        elapsed: number
    },
    packageLoss: number,
    isp: string,
    interface: {
        internalIp: string,
        name: string,
        maccAddr: string,
        isVpn: boolean,
        externalIp: string
    },
    server: {
        id: number,
        host: string,
        port: number,
        name: string,
        location: string,
        country: string,
        ip: string
    },
    result: {
        id: string,
        url: string,
        persisted: boolean
    }
}

type My5GSpeedTest = {
    code: number | null,
    download: number,
    upload: number,
    latency: number
}

async function runSpeedTest(): Promise<My5GSpeedTest> {
    const command: string = 'speedtest';
    const args: string[] = ['--format=json-pretty', '--progress=no'];
    
    const finished = new EventEmitter();
    const speedtest = spawn(command, args);

    let output = '';

    speedtest.stdout.on('data', data => {
        output += data.toString();
    });

    speedtest.on('error', error => {
        console.log(`error: ${error.message}`);
    });

    speedtest.on('close', code => {
        const testResult: SpeedTest = JSON.parse(output);
        // TODO: store for later inspection
        const result: My5GSpeedTest = {
            code: code,
            download: testResult.download.bandwidth / 100000,
            upload: testResult.upload.bandwidth / 100000,
            latency: testResult.ping.latency
        }
        finished.emit('test_finished', result);
    });

    return await new Promise( resolve => {
        finished.on('test_finished', resolve);
    });
}

export { runSpeedTest, My5GSpeedTest };
