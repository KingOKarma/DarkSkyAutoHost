import { STORAGE } from "../../../utils/globals";
import Storage from "../../../utils/storage";
import { TwitchCommands } from "../../../interfaces";
import { arrayPage } from "../../../utils/functions/arrayPage";
import { getUser } from "../../../utils/functions/getUser";

export const command: TwitchCommands = {
    // Note aliases are optional
    aliases: ["hosts", "h", "tohost"],
    description: "Used to add, remove or list users in the hosts list",
    example: ["!host list", "!host add user", "!host remove user"],
    group: "managment",
    modOnly: true,
    name: "host",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    run: async (client, msg, args) => {

        const { prefix } = client;

        const [subCommand, channel] = args;

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        switch (subCommand === undefined ? "none" : subCommand.toLowerCase()) {
            case "add": {

                // Checks if the role they want to add is already added
                if (STORAGE.canHost.includes(channel.toLowerCase())) {
                    return client.say(msg.params.target, `${channel} is already on the Hosts List! ❌`);
                }

                const user = await getUser(channel, client);

                if (user === null) return client.say(msg.params.target, "That user doesn't exist on twitch! Did you type in the name correctly?");

                // Otherwise finally add it to the list
                STORAGE.canHost.push(channel.toLowerCase());
                Storage.saveConfig();

                return client.say(msg.params.target,
                    `I have added the channel ${channel} to the Hosts list! ✅`
                );
            }

            case "remove": {

                // Checks if the role they want to add is already added
                if (!STORAGE.canHost.includes(channel.toLowerCase())) {
                    return client.say(msg.params.target, `${channel} is not on the Hosts List! ❌`);
                }

                // Checks the location in the array for the role
                const roleIndex = STORAGE.canHost.indexOf(channel.toLowerCase());

                // Removes the role from the array with the index number
                STORAGE.canHost.splice(roleIndex, 1);
                Storage.saveConfig();

                return client.say(msg.params.target,
                    `I have removed the channel ${channel}  from the Hosts List ✅`);
            }

            case "list": {
                if (!STORAGE.canHost.length) {
                    return client.say(msg.params.target,
                        `The Hosts List is currently emtpy! use ${prefix}host add <channel> `
                        + "to add a channel to the Hosts List!"
                    );
                }

                let page = Number(args[1] ?? "1");
                if (isNaN(page)) page = 1;
                if (page <= 0) page = 1;

                const pagedList = arrayPage(STORAGE.canHost, 10, Number(page));

                let finalPage = 1;
                let notMax = false;
                while (!notMax) {
                    const cmds = arrayPage(STORAGE.canHost, 10, Number(finalPage));
                    if (cmds.length !== 0) {
                        finalPage++;
                    } else {
                        notMax = true;
                    }
                }
                finalPage -= 1;

                if (page > finalPage) page = finalPage;

                if (pagedList.length === 0) return client.say(msg.params.target, "That page is empty! You can add more users via "
                    + `${prefix}host add <channel>`);

                const roleList = pagedList.map((list) => `${list}`);

                const roles = roleList.join(", ");
                return client.say(msg.params.target, `> listed channels: ${roles}`);
            }

            default: {
                return client.say(msg.params.target,
                    "> Please specify either `add`, `remove` or `list` when using this command, Example usage: "
                    + `${prefix}host add kingokarmatv`);
            }
        }

    }
};