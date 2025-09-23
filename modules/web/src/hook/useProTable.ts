import { useState, useCallback, useMemo, useRef } from 'react';
import { useQuery } from './useQuery';

export interface ProTableParams {
  page: number;
  pageSize: number;
  filters?: Record<string, any>;
  sorter?: {
    field: string;
    order: 'ascend' | 'descend';
  };
  search?: string;
}

export interface ProTableResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UseProTableOptions<T> {
  url: string;
  queryKey: string;
  defaultParams?: Partial<ProTableParams>;
  transformResponse?: (response: any) => ProTableResponse<T>;
  onError?: (error: any) => void;
  enableCache?: boolean; // Whether to enable pagination cache
  cacheTimeout?: number; // Cache timeout in milliseconds
}

// Cache item interface
interface CacheItem<T> {
  data: T[];
  total: number;
  timestamp: number;
}

// Cache store
interface CacheStore<T> {
  [key: string]: CacheItem<T>;
}

export function useProTable<T>(options: UseProTableOptions<T>) {
  const {
    url,
    queryKey,
    defaultParams = {},
    transformResponse,
    onError,
    enableCache = true,
    cacheTimeout = 5 * 60 * 1000, // Default 5 minutes
  } = options;

  const defaultPage = defaultParams.page || 1;
  const defaultPageSize = defaultParams.pageSize || 10;
  const defaultFilters = defaultParams.filters || {};
  const defaultSorter = defaultParams.sorter || null;
  const defaultSearch = defaultParams.search || '';

  const [pagination, setPaginationState] = useState({
    current: defaultPage,
    pageSize: defaultPageSize,
  });

  const [filters, setFiltersState] = useState<Record<string, any>>(defaultFilters);
  const [sorter, setSorterState] = useState<{ field: string; order: 'ascend' | 'descend' } | null>(defaultSorter);
  const [search, setSearchState] = useState(defaultSearch);

  // Cache store
  const cacheRef = useRef<CacheStore<T>>({});

  // Generate cache key
  const generateCacheKey = useCallback((params: any) => {
    return `${queryKey}-${JSON.stringify(params)}`;
  }, [queryKey]);

  // Get cached data
  const getCachedData = useCallback((cacheKey: string): CacheItem<T> | null => {
    if (!enableCache) return null;

    const cached = cacheRef.current[cacheKey];
    if (!cached) return null;

    // Check if cache is expired
    if (Date.now() - cached.timestamp > cacheTimeout) {
      delete cacheRef.current[cacheKey];
      return null;
    }

    return cached;
  }, [enableCache, cacheTimeout]);

  // Set cache data
  const setCachedData = useCallback((cacheKey: string, data: T[], total: number) => {
    if (!enableCache) return;

    cacheRef.current[cacheKey] = {
      data,
      total,
      timestamp: Date.now(),
    };
  }, [enableCache]);

  // Clear cache
  const clearCache = useCallback(() => {
    cacheRef.current = {};
  }, []);

  const requestParams = useMemo(() => {
    const params: any = {
      page: pagination.current,
      pageSize: pagination.pageSize,
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params[key] = value;
      }
    });

    if (sorter) {
      params.sortBy = sorter.field;
      params.sortOrder = sorter.order;
    }

    if (search) {
      params.search = search;
    }

    return params;
  }, [pagination, filters, sorter, search]);

  const queryKeyWithParams = useMemo(() => {
    return [queryKey, requestParams];
  }, [queryKey, requestParams]);

  // Check if there's cached data
  const cacheKey = generateCacheKey(requestParams);
  const cachedData = getCachedData(cacheKey);

  const { data: response, error, isLoading, mutate } = useQuery(
    queryKeyWithParams[0],
    url,
    {
      params: requestParams,
      // Skip request if there's cached data
      skip: !!cachedData,
    }
  );

  const transformedData = useMemo(() => {
    // Return cached data directly if available
    if (cachedData) {
      return {
        data: cachedData.data,
        total: cachedData.total,
        page: pagination.current,
        pageSize: pagination.pageSize,
      };
    }

    if (!response) {
      return { data: [], total: 0, page: 1, pageSize: 10 };
    }

    if (transformResponse) {
      const result = transformResponse(response);
      // Cache result
      setCachedData(cacheKey, result.data, result.total);
      return result;
    }

    // Use type assertion to handle response data
    const responseData = response as any;
    if (responseData.data && typeof responseData.total === 'number') {
      const result = {
        data: responseData.data,
        total: responseData.total,
        page: responseData.page || pagination.current,
        pageSize: responseData.pageSize || pagination.pageSize,
      };
      // Cache result
      setCachedData(cacheKey, result.data, result.total);
      return result;
    }

    if (Array.isArray(response)) {
      const result = {
        data: response,
        total: response.length,
        page: 1,
        pageSize: response.length,
      };
      // Cache result
      setCachedData(cacheKey, result.data, result.total);
      return result;
    }

    return { data: [], total: 0, page: 1, pageSize: 10 };
  }, [response, transformResponse, pagination, cachedData, cacheKey, setCachedData]);

  if (error && onError) {
    onError(error);
  }

  const setPagination = useCallback((newPagination: Partial<{ current: number; pageSize: number }>) => {
    setPaginationState(prev => ({
      ...prev,
      ...newPagination,
    }));
  }, []);

  const setFilters = useCallback((newFilters: Record<string, any>) => {
    setFiltersState(newFilters);
    setPaginationState(prev => ({ ...prev, current: 1 }));
  }, []);

  const setSorter = useCallback((newSorter: { field: string; order: 'ascend' | 'descend' } | null) => {
    setSorterState(newSorter);
    setPaginationState(prev => ({ ...prev, current: 1 }));
  }, []);

  const setSearch = useCallback((newSearch: string) => {
    setSearchState(newSearch);
    setPaginationState(prev => ({ ...prev, current: 1 }));
  }, []);

  const refresh = useCallback(() => {
    // Clear current page cache
    if (enableCache) {
      delete cacheRef.current[cacheKey];
    }
    mutate();
  }, [mutate, enableCache, cacheKey]);

  const reset = useCallback(() => {
    setPaginationState({ current: defaultPage, pageSize: defaultPageSize });
    setFiltersState(defaultFilters);
    setSorterState(defaultSorter);
    setSearchState(defaultSearch);
    // Clear all cache
    clearCache();
  }, [defaultPage, defaultPageSize, defaultFilters, defaultSorter, defaultSearch, clearCache]);

  const hasNextPage = useMemo(() => {
    return pagination.current * pagination.pageSize < transformedData.total;
  }, [pagination, transformedData.total]);

  const hasPrevPage = useMemo(() => {
    return pagination.current > 1;
  }, [pagination.current]);

  return {
    data: transformedData.data,
    total: transformedData.total,
    loading: isLoading,
    error,
    pagination: {
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: transformedData.total,
    },
    filters,
    sorter,
    search,
    setPagination,
    setFilters,
    setSorter,
    setSearch,
    refresh,
    reset,
    hasNextPage,
    hasPrevPage,
    // Cache related methods
    clearCache,
    isCached: !!cachedData,
  };
}