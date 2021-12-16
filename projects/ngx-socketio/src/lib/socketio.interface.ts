import { ManagerOptions, SocketOptions } from 'socket.io-client';

export interface SocketioConfig {
  uri: string,
  options?: Partial<SocketOptions & ManagerOptions>
}