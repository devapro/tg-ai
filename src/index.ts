import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import readline from 'readline';
import dotenv from "dotenv";

dotenv.config();

const apiId: number = process.env.TG_API_ID;
const apiHash: string = process.env.TG_API_HASH;
const stringSession = new StringSession(
    process.env.SESSION
); // fill this later with the value from session.save()

const groupsToListen = [
    "compose_broadcast",
    ""
]

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

   const result = await client.invoke(
    new Api.channels.GetFullChannel({
      channel: "compose_broadcast",
    })
  );
  console.log(result.fullChat.id); // prints the result

    // fetch messages
    const chat = "https://t.me/compose_broadcast";
    // for await (const message of client.iterMessages(chat, {limit: 10} )) {
    //    console.log(message.id, message.text)
    // }

    // subscribe to messages
    // client.addEventHandler(async (message: NewMessageEvent) => {
    //     console.log(message.chatId, message.isPrivate);
    //     // if(message.isPrivate!) {
    //     //     const c = await message.getChat();
    //     //     console.log(c)
    //     // }
    //     const c = await message.getChat();
    //         console.log(c)

        
    // }, new NewMessage({}));
})();
