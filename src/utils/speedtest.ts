import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import { exitCode } from 'process';

async function runSpeedTest(): Promise<number> {
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
        console.log(`stdout: ${output}`);
        finished.emit('test_finished', code);
    });

    return await new Promise( resolve => {
        finished.on('test_finished', resolve);
    });
}

export { runSpeedTest };
