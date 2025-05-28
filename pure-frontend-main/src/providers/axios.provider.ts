import axios from 'axios';

import { getBearerToken, isValidSession } from '@/common/services/auth.service';
import Emitter from '@/common/utils/event.utils';

const combineSignals = (...inputSignals: AbortSignal[] | [AbortSignal[]]) => {
    const signals = Array.isArray(inputSignals[0])
        ? inputSignals[0]
        : (inputSignals as AbortSignal[]);

    // if only one signal is provided, return it
    const len = signals.length;
    if (len === 1) return signals[0];

    // new signal setup
    const controller = new AbortController();
    const signal = controller.signal;

    // add event listener
    for (let i = 0; i < len; i++) {
        // if signal is already aborted, abort new signal
        if (signals[i].aborted) {
            controller.abort(signals[i].reason);
            break;
        }

        // else add on signal abort: abort new signal
        signals[i].addEventListener(
            'abort',
            () => {
                controller.abort(signals[i].reason);
            },
            { signal }
        );
    }

    return signal;
};

function makeDefaultAxiosInstance() {
    const axiosInstance = axios.create();

    axiosInstance.interceptors.request.use(async function (config) {
        const token = await getBearerToken();

        const controller = new AbortController();

        let signal = controller.signal;

        if (config.signal) {
            signal = combineSignals(signal, config.signal as AbortSignal);
        }

        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (
            config.headers.Authorization &&
            (!token || !(await isValidSession(token)))
        ) {
            Emitter.emit('SESSION_TIMEOUT', {});
            controller.abort();
        }

        return {
            ...config,
            signal,
        };
    });

    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            const { code } = error;

            if (code === 'ERR_NETWORK') {
                Emitter.emit('SERVER_INTERNAL_ERROR', {
                    message: 'Network error...',
                });
            }

            if (error.response?.status === 401) {
                if (error.response?.data.error_code === 40104) {
                    Emitter.emit('SESSION_TIMEOUT', {});
                }
            } else {
                if (error.response?.status === 500) {
                    Emitter.emit('SERVER_INTERNAL_ERROR', {
                        message: 'Server error...',
                    });
                }
                throw error;
            }
        }
    );

    return axiosInstance;
}

function makeAxiosPublicInstance() {
    const axiosInstance = axios.create();

    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            const { code } = error;

            if (code === 'ERR_NETWORK') {
                Emitter.emit('SERVER_INTERNAL_ERROR', {
                    message: 'Network error...',
                });
            }

            if (error.response?.status === 500) {
                Emitter.emit('SERVER_INTERNAL_ERROR', {
                    message: 'Server error...',
                });
            }

            throw error;
        }
    );

    return axiosInstance;
}

function makeAxiosGuardedInstance() {
    const axiosGuardedInstance = axios.create();

    axiosGuardedInstance.interceptors.request.use(async function (config) {
        const token = await getBearerToken();

        const controller = new AbortController();

        let signal = controller.signal;

        if (config.signal) {
            signal = combineSignals(signal, config.signal as AbortSignal);
        }

        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (
            !config.headers.Authorization ||
            !(await isValidSession(
                config.headers.Authorization.toString().split(' ')[1]
            ))
        ) {
            Emitter.emit('SESSION_TIMEOUT', {});
            controller.abort();
        }

        return {
            ...config,
            signal,
        };
    });

    axiosGuardedInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            const { code } = error;

            if (code === 'ERR_NETWORK') {
                Emitter.emit('SERVER_INTERNAL_ERROR', {
                    message: 'Network error...',
                });
            }

            if (error.response?.status === 401) {
                if (error.response?.data.error_code === 40104) {
                    Emitter.emit('SESSION_TIMEOUT', {});
                }
            } else {
                if (error.response?.status === 500) {
                    Emitter.emit('SERVER_INTERNAL_ERROR', {
                        message: 'Server error...',
                    });
                }

                throw error;
            }
        }
    );

    return axiosGuardedInstance;
}

export const axiosInstance = makeDefaultAxiosInstance();
export const axiosPublicInstance = makeAxiosPublicInstance();
export const axiosGuardedInstance = makeAxiosGuardedInstance();
