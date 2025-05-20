import type { TelegramClient } from 'telegram';
import { createChannelConfig, type ChannelConfig } from './create_channel_config';
import { NewMessage, type NewMessageEvent } from 'telegram/events';

export type ChannelMessageModel = {
    id: number;
    text: string;
    channel: ChannelConfig;
};

export async function channelListener(
    client: TelegramClient,
    channelsList: string[],
    onMessage: (message: ChannelMessageModel) => Promise<void>,
): Promise<void> {
    const channelConfigs = await createChannelConfig(client, channelsList);

    // subscribe to messages
    client.addEventHandler(async (message: NewMessageEvent) => {
        console.log(message.chatId, message.chat?.id, message.isPrivate);

        console.log('Message:', message.message.text);

        if (message.isPrivate) {
            console.log('Message is private');
            return;
        }

        const messageChannel = channelConfigs.find((channel) => {
            return message.chat?.id == channel.id;
        });
        if (messageChannel == undefined) {
            console.log('Message is not from channel');
            return;
        }
        if (message.message.text == undefined) {
            console.log('Message text is undefined');
            return;
        }
        if (message.message.text.length < 10) {
            console.log('Message text is too short');
            return;
        }

        onMessage({
            id: message.message.id,
            text: message.message.text,
            channel: messageChannel,
        });
    }, new NewMessage({}));
}
