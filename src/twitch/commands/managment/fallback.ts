import { STORAGE } from "../../../utils/globals";
import Storage from "../../../utils/storage";
import { TwitchCommands } from "../../../interfaces";
import { arrayPage } from "../../../utils/functions/arrayPage";
import { getUser } from "../../../utils/functions/getUser";

export const command: TwitchCommands = {
    // Note aliases are optional
    aliases: ["fb"],
    description: "Used to add, remove or list users in the fallback list",
    example: ["!fallback list", "!fallback add user", "!fallback remove user"],
    group: "managment",
    modOnly: true,
    name: "fallback",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    run: async (client, msg, args) => {
        const { prefix } = client;

        const [subCommand, channel] = args;

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        switch (subCommand === undefined ? "none" : subCommand.toLowerCase()) {
            case "add": {

                // Checks if the user they want to add is already added
                if (STORAGE.fallBackList.includes(channel.toLowerCase())) {
                    return client.say(msg.params.target, `${channel} is already on the Fallback List! ❌`);
                }

                const user = await getUser(channel, client);

                if (user === null) return client.say(msg.params.target, "That user doesn't exist on twitch! Did you type in the name correctly?");
                // Otherwise finally add it to the list
                STORAGE.fallBackList.push(user.name);
                Storage.saveConfig();

                return client.say(msg.params.target,
                    `I have added the channel ${channel} to the Fallback List! ✅`
                );
            }

            case "remove": {

                // Checks if the role they want to add is already added
                if (!STORAGE.fallBackList.includes(channel.toLowerCase())) {
                    return client.say(msg.params.target, `${channel} is not on the Fallback List! ❌`);
                }

                // Checks the location in the array for the role
                const roleIndex = STORAGE.fallBackList.indexOf(channel.toLowerCase());

                // Removes the role from the array with the index number
                STORAGE.fallBackList.splice(roleIndex, 1);
                Storage.saveConfig();

                return client.say(msg.params.target,
                    `I have removed the channel ${channel}  from the list ✅`);
            }

            case "list": {
                if (!STORAGE.fallBackList.length) {
                    return client.say(msg.params.target,
                        `The Fallback list is currently emtpy! use ${prefix}fallback add <channel> `
                        + "to add a channel to the Fallback List!"
                    );
                }

                let page = Number(args[1] ?? "1");
                if (isNaN(page)) page = 1;
                if (page <= 0) page = 1;

                const pagedList = arrayPage(STORAGE.fallBackList, 10, Number(page));

                let finalPage = 1;
                let notMax = false;
                while (!notMax) {
                    const cmds = arrayPage(STORAGE.fallBackList, 10, Number(finalPage));
                    if (cmds.length !== 0) {
                        finalPage++;
                    } else {
                        notMax = true;
                    }
                }
                finalPage -= 1;

                if (page > finalPage) page = finalPage;

                if (pagedList.length === 0) return client.say(msg.params.target, "That page is empty! You can add more users via "
                    + `${prefix}fallback add <channel>`);

                const roleList = pagedList.map((list) => `${list}`);

                const roles = roleList.join(", ");
                return client.say(msg.params.target, `> listed channels:${roles}`);
            }

            default: {
                return client.say(msg.params.target,
                    "> Please specify either `add`, `remove` or `list` when using this command, Example usage: "
                    + `${prefix}fallback add kingokarmatv`);
            }
        }


    }
};