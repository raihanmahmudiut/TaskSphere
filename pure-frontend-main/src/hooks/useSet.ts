import { useMemo, useRef, useState } from 'react';

export function useSet<T>(initialValue: T[]) {
    const triggerRender = useState(0)[1];
    const set = useRef(new Set<T>(initialValue));

    return useMemo(
        () =>
            ({
                add(item) {
                    if (set.current.has(item)) return;
                    set.current.add(item);
                    triggerRender((i) => ++i);
                },
                delete(item) {
                    if (!set.current.has(item)) return;
                    set.current.delete(item);
                    triggerRender((i) => ++i);
                },
                clear() {
                    if (set.current.size === 0) return;
                    set.current.clear();
                    triggerRender((i) => ++i);
                },
                replace(values: T[]) {
                    set.current = new Set<T>(values);
                    triggerRender((i) => ++i);
                },
                has: (item) => set.current.has(item),
                keys: () => set.current.keys(),
                values: () => set.current.values(),
                forEach: (...args) => set.current.forEach(...args),
                map<U>(callbackfn: (value: T) => U): Set<U> {
                    const resultSet = new Set<U>();
                    set.current.forEach((value) => {
                        resultSet.add(callbackfn(value));
                    });

                    return resultSet;
                },
                [Symbol.iterator]: () => set.current.values(),
                get size() {
                    return set.current.size;
                },
            }) as Set<T> & {
                replace: (values: T[]) => void;
                map: <U>(callbackfn: (value: T) => U) => Set<U>;
            },
        [triggerRender]
    );
}
