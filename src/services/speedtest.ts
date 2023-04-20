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
    error: string | undefined,
    download: number | undefined,
    upload: number | undefined,
    latency: number | undefined
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
        let result: My5GSpeedTest = {
            code: code,
            error: undefined,
            download: undefined,
            upload: undefined,
            latency: undefined
        };

        if (code != 0) {
            console.log(`ERROR: ${code}`);
            console.log(output);
            result.error = output;
        }

        try {
            if (code == 0) {
                const testResult: SpeedTest = JSON.parse(output);
                // TODO: store for later inspection
    
                result.download = testResult.download.bandwidth / 100000;
                result.upload = testResult.upload.bandwidth / 100000;
                result.latency = testResult.ping.latency;
            }
        } catch (error) {
            console.log(`ERROR: ${error}`);
        } finally {
            finished.emit('test_finished', result);
        } 
    });

    return await new Promise( resolve => {
        finished.on('test_finished', resolve);
    });
}

export { runSpeedTest, My5GSpeedTest };
