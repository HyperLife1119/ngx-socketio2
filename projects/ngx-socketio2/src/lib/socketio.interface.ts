import { ManagerOptions, SocketOptions } from 'socket.io-client';

export interface SocketioConfig {
  url: string,
  options?: Partial<SocketOptions & ManagerOptions>
}