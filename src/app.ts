import './utils/env';
import { App, LogLevel } from '@slack/bolt'
import { runSpeedTest } from './services/speedtest';

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
    // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
    // you still need to listen on some port!
    port: Number(process.env.PORT) || 3000,
    logLevel: LogLevel.ERROR
});

app.use(async ({next}) => {
    await next();
});

// export to function?

app.message('hello', async ({ message, say }) => {
    // Filter out message events with subtypes (see https://api.slack.com/events/message)
    if (message.subtype === undefined || message.subtype === 'bot_message') {
        // say() sends a message to the channel where the event was triggered
        await say({
            blocks: [
                {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `Hey there <@${message.user}>!`,
                },
                accessory: {
                    type: 'button',
                    text: {
                    type: 'plain_text',
                    text: 'Start a speed test?',
                    },
                    action_id: 'run_speed_test',
                },
                },
            ],
            text: `Hey there <@${message.user}>!`,
        });
    }
});

app.action('run_speed_test', async ({ body, ack, say }) => {
    // Acknowledge the action
    await ack();
    say(`Got it. <@${body.user.id}>. I'll let you know the result once it's done.`);
    const result = await runSpeedTest();
    say(`Hey <@${body.user.id}>. This is the result that I promised:\
        \n Download speed: ${result.download} Mbps\
        \n Upload speed: ${result.upload} Mbps\
        \n Latency: ${result.latency} ms\
    `)
});

(async () => {
    // Start your app
    await app.start();
  
    console.log('⚡️ Bolt app is running!');
})();