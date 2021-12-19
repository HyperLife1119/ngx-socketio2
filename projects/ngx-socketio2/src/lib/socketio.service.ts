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

  /**
   * @see {@link Socket.id}
   */
  get id(): string { return this.socket.id };

  /**
   * @see {@link Socket.connected}
   */
  get connected(): boolean { return this.socket.connected };

  /**
   * @see {@link Socket.disconnected}
   */
  get disconnected(): boolean { return this.socket.disconnected };

  /**
   * @see {@link Socket.io}
   */
  get io(): Manager { return this.socket.io };

  /**
   * @see {@link Socket.auth}
   */
  get auth(): Socket['auth'] { return this.socket.auth };
  set auth(auth: Socket['auth']) { this.socket.auth = auth };

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

  /**
   * @see {@link Socket.connect}
   */
  connect(): this {
    this.socket.connect();
    return this;
  }

  /**
   * @see {@link Socket.disconnect}
   */
  disconnect(): this {
    this.socket.disconnect();
    return this;
  }

  /**
   * @see {@link Socket.send}
   */
  send(...args: any[]): this {
    this.socket.send(...args);
    return this;
  }

  /**
   * @see {@link Socket.emit}
   */
  emit(eventName: string, ...args: any[]): this {
    this.socket.emit(eventName, ...args);
    return this;
  }

  /**
   * @see {@link Socket.onAny}
   */
  on<T>(): Observable<{ eventName: string, args: T }>
  /**
   * @see {@link Socket.on}
   */
  on<T>(eventName?: string): Observable<T>
  on<T extends any>(eventName?: string): Observable<T> | Observable<{ eventName: string, args: T }> {
    const observable = this.subject.asObservable();

    if (!eventName) {
      return observable.pipe(
        map(({ eventName, args }) => ({
          eventName,
          args: (args.length === 1 ? args[0] : args) as T
        }))
      );
    }

    return observable.pipe(
      filter(o => o.eventName === eventName),
      map(({ args }) => (args.length === 1 ? args[0] : args) as T)
    );
  }

  /**
   * @see {@link Socket.once}
   */
  once<T>(eventName: string): Observable<T> {
    return this.on<T>(eventName).pipe(take(1));
  }

  /**
   * @see {@link Socket.compress}
   */
  compress(compress: boolean): this {
    this.socket.compress(compress);
    return this;
  }
}
