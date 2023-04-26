import * as Schedule from 'node-schedule';
import { EventEmitter } from 'events';
import { runSpeedTest } from './speedtest'
import '../utils/env';
import type { ScheduledTest } from '../../types/services';

export function scheduleSpeedTest(scheduledResult: ScheduledTest, finishTestEvent: EventEmitter, cron: string) { 
    Schedule.scheduleJob(cron, async function (fireTime) { 
        scheduledResult.time = fireTime;
        scheduledResult.result = await runSpeedTest();
        finishTestEvent.emit('scheduled_test_finished');
    });
}