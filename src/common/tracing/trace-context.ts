import { AsyncLocalStorage } from 'async_hooks';

type Store = {
  traceId: string;
};

export const traceStorage = new AsyncLocalStorage<Store>();

export const getTraceId = () => {
  return traceStorage.getStore()?.traceId || 'no-trace';
};
