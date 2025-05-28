import { useCallback, useEffect, useState } from 'react';

export const useAsync = <T>(
    callback: (...args: Anything[]) => Promise<T>,
    dependencies: string[] = []
) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [value, setValue] = useState<T | null>(null);

    const callbackMemoized = useCallback(
        (...args: Anything[]) => {
            setLoading(true);
            setError(null);
            setValue(null);
            callback(args)
                .then(setValue)
                .catch(setError)
                .finally(() => setLoading(false));
        },
        [...dependencies]
    );

    useEffect(() => {
        const abortController = new AbortController();
        callbackMemoized(abortController.signal);

        return () => {
            abortController.abort();
        };
    }, [callbackMemoized]);

    return { loading, error, data: value, setData: setValue };
};
