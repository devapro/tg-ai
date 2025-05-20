import { Api, type TelegramClient } from 'telegram';
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
  
        if (message.message.peerId instanceof Api.PeerChannel) {
            console.log('Channel id:', message.message.peerId.channelId, message.isPrivate);
        }

        console.log('Message:', message.message.text);

        if (message.isPrivate) {
            console.log('Message is private');
            return;
        }

        const messageChannel = channelConfigs.find((channel) => {
            if (message.message.peerId instanceof Api.PeerChannel) {
                console.log('Channel id:', channel.id);
                console.log('channelId:', message.message.peerId.channelId);
                console.log(message.message.peerId.channelId.compareTo(channel.id) == 0);
                return message.message.peerId.channelId.compareTo(channel.id) == 0;
            }
            return false;
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
