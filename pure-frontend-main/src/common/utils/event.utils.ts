import EventEmitter from 'eventemitter3';

const eventEmitter = new EventEmitter();

const Emitter = {
    on: (event: string, fn: (...args: Array<Anything>) => void) =>
        eventEmitter.on(event, fn),
    once: (event: string, fn: (...args: Array<Anything>) => void) =>
        eventEmitter.once(event, fn),
    off: (event: string, fn: (...args: Array<Anything>) => void) =>
        eventEmitter.off(event, fn),
    emit: <T>(event: string, payload: T) => eventEmitter.emit(event, payload),
};

Object.freeze(Emitter);

export default Emitter;
