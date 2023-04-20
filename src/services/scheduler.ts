import * as Schedule from 'node-schedule';
import { EventEmitter } from 'events';
import { runSpeedTest, My5GSpeedTest } from './speedtest'

interface ScheduledTest {
    time: Date | undefined,
    result: My5GSpeedTest | undefined
}

// Ref: https://crontab.guru/#0_*/3_*_*_*
const cronRule = '0 */3 * * *';

function scheduleSpeedTest(scheduledResult: ScheduledTest, finishTestEvent: EventEmitter) : any {
    Schedule.scheduleJob(cronRule, async function (fireTime) { 
        scheduledResult.time = fireTime;
        scheduledResult.result = await runSpeedTest();
        finishTestEvent.emit('scheduled_test_finished');
    });
}

export { scheduleSpeedTest, ScheduledTest };