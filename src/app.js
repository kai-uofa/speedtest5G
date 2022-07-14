import './utils/env';
import { App, LogLevel } from '@slack/bolt'

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
    // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
    // you still need to listen on some port!
    port: process.env.PORT || 3000,
    logLevel: LogLevel.DEBUG
});

app.use(async ({next}) => {
    await next();
});

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
                    text: 'Click Me',
                    },
                    action_id: 'button_click',
                },
                },
            ],
            text: `Hey there <@${message.user}>!`,
        });
    }
})

app.action('button_click', async ({ body, ack, say }) => {
    // Acknowledge the action
    await ack();
    await say(`<@${body.user.id}> clicked the button`);
});

(async () => {
    // Start your app
    await app.start();
  
    console.log('⚡️ Bolt app is running!');
})();