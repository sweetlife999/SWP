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
  const startTimeRef = useRef<number>(0);
  const minLoadingTime = 300; // 300ms минимальное время загрузки

  const fetchData = useCallback(async () => {
    startTimeRef.current = Date.now();
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Ждем минимальное время загрузки
      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsed));
      }
      
      setState({ data, loading: false, error: null });
    } catch (err) {
      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsed));
      }
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load data',
      });
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const retry = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, retry };
}
