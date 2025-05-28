import Emitter from './event.utils';

export function isAsyncFunction(func: AsyncFunction) {
    return func.constructor.name === 'AsyncFunction';
}

export function mustBeAsyncFunctionOrFail(func: AsyncFunction) {
    if (isAsyncFunction(func)) return func;
    else throw new Error('Provided function must be async.');
}

// Adjust tryCatchWrapper to accept a generic function type
export async function tryCatchWrapper<T extends AsyncFunction>(
    apiCall: T,
    errorMessage: string,
    ...args: Parameters<T> // Pass additional parameters to the API call
): Promise<ReturnType<T> | undefined> {
    try {
        return await apiCall(...args);
    } catch {
        Emitter.emit('Api Error', {
            message: errorMessage,
        });
    }
}
