# ngx-socketio

[![npm version](https://img.shields.io/npm/v/ngx-socketio/latest.svg)](https://npmjs.com/package/@taiga-ui/cdk)
![Node.js CI](https://github.com/HyperLife1119/ngx-socketio/workflows/Node.js%20CI/badge.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
[![Angular](https://img.shields.io/badge/Build%20with-Angular%20CLI-red?logo=angular)](https://www.github.com/angular/angular)

A better [Socket.IO](https://socket.io) module for [Angular](https://angular.io).

## Features

- The ability to type event objects.
- More complete API.
- Support chain call.
- Responsive event listener.

## Prerequisites

- [Angular](https://angular.io) >= 10.0.0
- [Socket.IO](https://socket.io) >= 4.0.0


## Install

```shell
npm i ngx-socketio
```

## Usage

Import and configure the `SocketioModule`:

```ts
import { SocketioModule } from 'ngx-socketio';

@NgModule({
  // ...
  imports: [
    // ...
    SocketioModule.forRoot({
      url: 'http://localhost:4200',
      options: {
        // Socket.IO client options
      }
    })
  ]
})
export class YourModule { }
```

Getting Socketio Service via DI:

```ts
import { Injectable } from '@angular/core';
import { Socketio } from 'ngx-socketio';
import { tap } from 'rxjs/operators';

@Injectable()
export class YourService {
  constructor(private socket: Socketio) {}

  sendMessage(msg: string) {
    this.socket.emit('message', msg);
  }

  sendMessages(msg1: string, msg2: string) {
    // Chain call.
    this.socket.emit('message', msg1).emit('message', msg2);
  }

  getMessage() {
    return this.socket.on<string>('message').pipe(
      tap((args: string) => {
        // Do something...
      })
    );
  }

  getAll() {
    // Listen to all events.
    return this.socket.on<any>().pipe(
      tap((data: { eventName: string, args: any }) => {
        // Do something...
      })
    );
  }
}
```

Using multiple sockets with different endpoints:

In this case, we no longer need the `SocketioModule`. Instead, use a new service that inherits from the `Socketio` service and passes the configuration by calling `super(config)`.

```ts
import { Injectable } from '@angular/core';
import { Socketio } from 'ngx-socketio';

@Injectable()
export class Socketio1Service extends Socketio {
  constructor() {
    super({ url: 'http://localhost:4200' })
  }
}

@Injectable()
export class Socketio2Service extends Socketio {
  constructor() {
    super({ url: 'http://localhost:6200' })
  }
}
```

```ts
@NgModule({
  // ...
  providers: [
    // ...
    Socketio1Service,
    Socketio2Service
  ]
})
export class YourModule { }
```

## API

| Name | API | Description |
| ---- | --- | ----------- |
| SocketioModule | .forRoot({ url[, options] })       | [https://socket.io/docs/v4/client-api/#iourl](https://socket.io/docs/v4/client-api/#iourl) |
| Socketio       | .id                                | [https://socket.io/docs/v4/client-api/#socketid](https://socket.io/docs/v4/client-api/#socketid) |
|                | .connected                         | [https://socket.io/docs/v4/client-api/#socketconnected](https://socket.io/docs/v4/client-api/#socketconnected) |
|                | .disconnected                      | [https://socket.io/docs/v4/client-api/#socketdisconnected](https://socket.io/docs/v4/client-api/#socketdisconnected) |
|                | .io                                | [https://socket.io/docs/v4/client-api/#socketio](https://socket.io/docs/v4/client-api/#socketio) |
|                | .auth                              | [https://socket.io/docs/v4/client-options/#auth](https://socket.io/docs/v4/client-options/#auth) |
|                | .connect()                         | [https://socket.io/docs/v4/client-api/#socketconnect](https://socket.io/docs/v4/client-api/#socketconnect) |
|                | .disconnect()                      | [https://socket.io/docs/v4/client-api/#socketdisconnect](https://socket.io/docs/v4/client-api/#socketdisconnect) |
|                | .send([...args][, ack])            | [https://socket.io/docs/v4/client-api/#socketsendargs](https://socket.io/docs/v4/client-api/#socketsendargs) |
|                | .emit(eventName[, ...args][, ack]) | [https://socket.io/docs/v4/client-api/#socketemiteventname-args](https://socket.io/docs/v4/client-api/#socketemiteventname-args) |
|                | .on()                              | [https://socket.io/docs/v4/client-api/#socketoneventname-callback](https://socket.io/docs/v4/client-api/#socketoneventname-callback) |
|                | .on(eventName)                     | [https://socket.io/docs/v4/client-api/#socketonanycallback](https://socket.io/docs/v4/client-api/#socketonanycallback) |
|                | .once(eventName)                   | Similar to `.on(eventName)`, but only responds once. |
|                | .compress(compress)                | [https://socket.io/docs/v4/client-api/#socketcompressvalue](https://socket.io/docs/v4/client-api/#socketcompressvalue) |

## Q&A

Why choose this library? It is more complete, younger and modern than [ngx-socket-io](https://www.npmjs.com/package/ngx-socket-io).

## Stats

![Stats](https://repobeats.axiom.co/api/embed/59f75da44a2887a253ee62d72389ee17ee6a8563.svg "Repobeats analytics image")