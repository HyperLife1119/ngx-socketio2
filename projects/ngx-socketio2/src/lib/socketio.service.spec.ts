import { TestBed } from '@angular/core/testing';
import { Socket } from './socketio.service';

describe('Socket', () => {
  let service: Socket;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Socket);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
