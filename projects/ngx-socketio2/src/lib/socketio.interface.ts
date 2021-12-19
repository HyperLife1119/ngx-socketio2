import { ManagerOptions, SocketOptions } from 'socket.io-client';

export interface SocketioConfig {
  url: string,
  /** @see {@link ManagerOptions} */
  options?: Partial<SocketOptions & ManagerOptions>
}