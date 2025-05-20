import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import readline from 'readline';
import dotenv from 'dotenv';
import { checkContent } from './gemeni';
import { exit } from 'process';

dotenv.config();

const apiId: number = parseInt(process.env.TG_API_ID);
const apiHash: string = process.env.TG_API_HASH;

// console.log(process.env.TG_API_HASH);
// console.log(apiId, apiHash);
// exit(0);

const stringSession = new StringSession(process.env.SESSION); // fill this later with the value from session.save()

const groupsToListen = [
    'compose_broadcast',
    'mobile_appsec_world',
    'mobiledeveloperchat',
    'mobi_dev',
    'alexgladkovblog',
    'androidMalware',
    'apptractor',
    'kotlin_broadcast',
    'android_broadcast',
    'applib',
    'compose_broadcast',
    'mobiledevnews',
    'droidgr',
    'startandroid',
    'android_under_the_hood',
    'mobile_native',
    'android_live',
    'android_guards_today',
    'mobile_compose',
    'android_core',
];

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
    //await client.sendMessage('me', { message: 'Hello!' });

    //await client.sendMessage('https://t.me/droidrss', { message: 'Hello!' });

    // fetch messages
    const chat = 'https://t.me/compose_broadcast';
    for await (const message of client.iterMessages(chat, { limit: 20 })) {
        console.log(message.id, message.text);
        if (message.text == undefined) {
            console.log('Message text is undefined');
            continue;
        }
        if (message.text.length < 10) {
            console.log('Message text is too short');
            continue;
        }
        const result = await checkContent(message.text);
        if (result.summary != undefined && result.summary.length > 0) {
            console.log(result);
            await client.sendMessage('https://t.me/droidrss', {
                message: `
${chat}/${message.id}
${result.summary}
${result.url}
`,
            });
        }
    }
})();
