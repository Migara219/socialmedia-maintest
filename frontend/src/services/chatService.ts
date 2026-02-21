import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const socketUrl = "http://localhost:8080/chat/websocket";

let client: Client | null = null;

export const getChatClient = (): Client => {
    if (!client) {
        client = new Client({
            webSocketFactory: () => new SockJS(socketUrl), // Use SockJS for fallback
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
        });
    }
    return client;
};

export const activateClient = () => {
    const chatClient = getChatClient();
    if (!chatClient.active) {
        chatClient.activate();
    }
};

export const deactivateClient = () => {
    if (client && client.active) {
        client.deactivate();
    }
};
