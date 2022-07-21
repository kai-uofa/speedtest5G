import * as Schedule from 'node-schedule';
import { EventEmitter } from 'events';
import { runSpeedTest, My5GSpeedTest } from './speedtest'

interface ScheduledTest {
    time: Date | undefined,
    result: My5GSpeedTest | undefined
}

function scheduleSpeedTest(scheduledResult: ScheduledTest, finishTestEvent: EventEmitter) : any {
    Schedule.scheduleJob('*/3 * * *', async function (fireTime) { 
        scheduledResult.time = fireTime;
        scheduledResult.result = await runSpeedTest();
        finishTestEvent.emit('scheduled_test_finished');
    });
}

export { scheduleSpeedTest, ScheduledTest };