import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import readline from 'readline';
import dotenv from 'dotenv';
import { checkContent } from './gemeni';
import { channelListener, type ChannelMessageModel } from './components/channel_listener';
import { channelsList } from './components/channels_list';

dotenv.config();

const apiId: number = parseInt(process.env.TG_API_ID);
const apiHash: string = process.env.TG_API_HASH;

const stringSession = new StringSession(process.env.SESSION); // fill this later with the value from session.save()

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

(async () => {
    console.log('Loading interactive example...');
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });
    await client.start({
        phoneNumber: async () =>
            new Promise((resolve) => rl.question('Please enter your number: ', resolve)),
        password: async () =>
            new Promise((resolve) => rl.question('Please enter your password: ', resolve)),
        phoneCode: async () =>
            new Promise((resolve) => rl.question('Please enter the code you received: ', resolve)),
        onError: (err) => console.log(err),
    });
    console.log('You should now be connected.');
    console.log(client.session.save()); // Save this string to avoid logging in again

    channelListener(client, channelsList, async (message: ChannelMessageModel) => {
        const result = await checkContent(message.text);
        if (result.summary != undefined && result.summary.length > 0) {
            console.log(result);
            await client.sendMessage('https://t.me/droidrss', {
                message: `
${message.channel.url}/${message.id}
${result.summary}
${result.url}
`,
            });
        }
    });
})();
