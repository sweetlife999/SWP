import { useState, useEffect, useCallback, useRef } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string, options?: RequestInit) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const [retryCount, setRetryCount] = useState(0);
  const startTimeRef = useRef<number>(0);
  const minLoadingTime = 300;

  useEffect(() => {
    const controller = new AbortController();
    startTimeRef.current = Date.now();
    const opts = options ? { ...options, signal: controller.signal } : { signal: controller.signal };

    fetch(url, opts)
      .then(async response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json() as T;
        const elapsed = Date.now() - startTimeRef.current;
        if (elapsed < minLoadingTime) {
          await new Promise<void>(resolve => setTimeout(resolve, minLoadingTime - elapsed));
        }
        setState({ data, loading: false, error: null });
      })
      .catch(async err => {
        if ((err as Error).name === 'AbortError') return;
        const elapsed = Date.now() - startTimeRef.current;
        if (elapsed < minLoadingTime) {
          await new Promise<void>(resolve => setTimeout(resolve, minLoadingTime - elapsed));
        }
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load data',
        });
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, retryCount]);

  const retry = useCallback(() => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    setRetryCount(c => c + 1);
  }, []);

  return { ...state, retry };
}
