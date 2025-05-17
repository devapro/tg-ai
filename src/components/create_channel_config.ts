import { Api, type TelegramClient } from "telegram";

export type ChannelConfig = {
    url: string;
    id: bigInt.BigInteger;
}

export async function createChannelConfig(client: TelegramClient, channelsList: string[]): Promise<ChannelConfig[]> {
   
    const channelConfigs: ChannelConfig[] = [];

    for (const channel of channelsList) {
        const result = await client.invoke(
        new Api.channels.GetFullChannel({
            channel: channel
        }),
    );
        channelConfigs.push({
            url: `https://t.me/${channel}`,
            id: result.fullChat.id,
        });
    }

    return channelConfigs;

}