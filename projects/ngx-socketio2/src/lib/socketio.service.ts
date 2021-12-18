import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { io, Manager, Socket } from 'socket.io-client';
import { SocketioConfig } from './socketio.interface';
import { SOCKETIO_CONFIG } from './socketio.token';

@Injectable()
export class Socketio implements OnDestroy {
  private subject: Subject<{ eventName: string, args: any[] }> = new Subject();
  private socket: Socket;

  get id(): string { return this.socket.id };
  get connected(): boolean { return this.socket.connected };
  get disconnected(): boolean { return this.socket.disconnected };
  get io(): Manager { return this.socket.io };
  get auth(): Socket['auth'] { return this.socket.auth };

  constructor(
    @Inject(SOCKETIO_CONFIG) { url, options }: SocketioConfig
  ) {
    this.socket = io(url, options);
    this.socket.onAny((eventName: string, ...args: any[]) => {
      this.subject.next({ eventName, args });
    });
  }

  ngOnDestroy(): void {
    this.socket.offAny();
    this.subject.complete();
  }

  connect(): this {
    this.socket.connect();
    return this;
  }

  disconnect(): this {
    this.socket.disconnect();
    return this;
  }

  send(...args: any[]): this {
    this.socket.send(...args);
    return this;
  }

  emit(eventName: string, ...args: any[]): this {
    this.socket.emit(eventName, ...args);
    return this;
  }

  on<T>(): Observable<{ eventName: string, args: T }>
  on<T>(eventName?: string): Observable<T>
  on<T extends any>(eventName?: string): Observable<T> | Observable<{ eventName: string, args: T }> {
    const observable = this.subject.asObservable();

    if (!eventName) {
      return observable.pipe(
        map(({ args }) => (args.length === 1 ? args[0] : args) as T)
      );
    }

    return observable.pipe(
      filter(o => o.eventName === eventName),
      map(({ args }) => (args.length === 1 ? args[0] : args) as T)
    );
  }

  once<T>(eventName: string): Observable<T> {
    return this.on<T>(eventName).pipe(take(1));
  }

  compress(compress: boolean): this {
    this.socket.compress(compress);
    return this;
  }
}
