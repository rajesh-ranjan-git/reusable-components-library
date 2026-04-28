import { io, Socket } from "socket.io-client";
import { HOST_URL } from "@/constants/env.constants";
import { SocketConfigType } from "@/types/types/socket.types";

export const createSocketConnection = ({ token }: SocketConfigType): Socket => {
  const isLocal =
    typeof window !== "undefined" && window.location.hostname === "localhost";

  return io(HOST_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    auth: { token },
    ...(!isLocal && { path: "/api/v1/socket.io" }),
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1_000,
    reconnectionDelayMax: 30_000,
    randomizationFactor: 0.5,
    timeout: 20_000,
  });
};
