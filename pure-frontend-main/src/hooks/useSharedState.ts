import useSWR from 'swr';

const useSharedState = <T>(key: string, initial: T) => {
    const { data: state, mutate: setState } = useSWR<T>(key, {
        fallbackData: initial,
    });

    return [state, setState] as const;
};

export default useSharedState;
