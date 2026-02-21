const BASE_URL = "http://localhost:8080/ws"; // Adjust for your server

export const getChatRooms = async () => {
  const response = await fetch(`${BASE_URL}/chatroom`);
  return response.json();
};

export const getChatMessages = async (chatRoomId: string) => {
  const response = await fetch(`${BASE_URL}/messages/${chatRoomId}`);
  return response.json();
};

export const sendMessage = async (message: any) => {
  const response = await fetch(`${BASE_URL}/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
  return response.json();
};
