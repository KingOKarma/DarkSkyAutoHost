import ChatClient, { authProvider } from "./client/client";
import { CONFIG } from "./utils/globals";

new ChatClient(
    { authProvider, channels: CONFIG.twitchUsernames })
    .initChatClient().catch(console.error);

