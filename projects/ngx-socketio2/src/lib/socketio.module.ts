import { ModuleWithProviders, NgModule } from '@angular/core';
import { SocketioConfig } from './socketio.interface';
import { Socket } from './socketio.service';
import { SOCKETIO_CONFIG } from './socketio.token';

@NgModule()
export class SocketioModule {
  static forRoot(config: SocketioConfig = { url: '' }): ModuleWithProviders<SocketioModule> {
    return {
      ngModule: SocketioModule,
      providers: [
        { provide: SOCKETIO_CONFIG, useValue: config },
        Socket,
      ],
    };
  }
}
