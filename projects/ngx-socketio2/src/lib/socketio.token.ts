import { InjectionToken } from '@angular/core';
import { SocketioConfig } from './socketio.interface';

export const SOCKETIO_CONFIG = new InjectionToken<SocketioConfig>('SocketioConfig');