/* eslint-disable @typescript-eslint/no-unused-vars */
import { CONFIG, STORAGE } from "../../utils/globals";
import { ChatClient } from "twitch-chat-client/lib";
import Storage from "../../utils/storage";
import { TwitchPrivateMessage } from "twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage";
import { checkPerms } from "../../utils/events";

exports.run = async (chatClient: ChatClient,
    channelHash: string,
    user: string,
    message: string,
    msg: TwitchPrivateMessage,
    args: string[]): Promise<void> => {

    const { prefix } = CONFIG;

    const author = msg.userInfo.displayName;
    if (!checkPerms(msg)) {
        return chatClient.say(channelHash, `@${author} This commmand can only be used by moderators and above!`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (args[0] === undefined) {
        return chatClient.say(channelHash,
            "> Please specify either `add`, `remove` or `list` when using this command, \n**Example usage:** "
                + `\`${prefix}block add king_o_karma\``);
    }
    switch (args[0].toLowerCase()) {
        case "add": {
            // eslint-disable-next-line prefer-destructuring
            const channel = args[1];

            // Checks if the role they want to add is already added
            if (STORAGE.usersBlacklist.includes(channel.toLowerCase())) {
                return chatClient.say(channelHash, `\`${channel}\` is already on the list! ❌`);
            }

            // Otherwise finally add it to the list
            STORAGE.usersBlacklist.push(channel.toLowerCase());
            Storage.saveConfig();

            return chatClient.say(channelHash,
                `I have added the channel \`${channel}\` to the list! ✅`
            );
        }

        case "remove": {
            // eslint-disable-next-line prefer-destructuring
            const channel = args[1];

            // Checks if the role they want to add is already added
            if (!STORAGE.usersBlacklist.includes(channel.toLowerCase())) {
                return chatClient.say(channelHash, `\`${channel}\` is not on the list! ❌`);
            }

            // Checks the location in the array for the role
            const roleIndex = STORAGE.usersBlacklist.indexOf(channel.toLowerCase());

            // Removes the role from the array with the index number
            STORAGE.usersBlacklist.splice(roleIndex, 1);
            Storage.saveConfig();

            return chatClient.say(channelHash,
                `I have removed the channel \`${channel} \` from the list ✅`);
        }

        case "list": {
            if (!STORAGE.usersBlacklist.length) {
                return chatClient.say(channelHash,
                    `The list is currently emtpy! use ${prefix}block addd <channel> `
                        + "to add a channel to the list!"
                );
            }
            function paginate(array: string[], pageSize: number, pageNumber: number): string[] {
                return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
            }
            // eslint-disable-next-line prefer-destructuring
            let page = args[1];
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (args[1] === undefined) page = "1";

            const pagedList = paginate(STORAGE.usersBlacklist, 10, Number(page));

            if (pagedList.length === 0) return chatClient.say(channelHash, "That page is empty!\n You can add more users via "
                    + `\`${prefix}block add <channelName>\``);

            const roleList = pagedList.map((list) => `> ○ ${list}\n`);
            const roles = roleList.join("");
            return chatClient.say(channelHash, `> listed channels:\n> ${roles}`);

        }

        default: {
            return chatClient.say(channelHash,
                "> Please specify either `add`, `remove` or `list` when using this command, \n**Example usage:** "
                    + `\`${prefix}block add king_o_karma\``);
        }
    }
};