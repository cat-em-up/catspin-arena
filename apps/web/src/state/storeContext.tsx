import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createClientStore, type ClientStore } from "./store";

const StoreContext = createContext<ClientStore | null>(null);

export type StoreProviderProps = {
  children: ReactNode;
};

export function StoreProvider({ children }: StoreProviderProps) {
  const store = useMemo(() => {
    return createClientStore({
      apiBaseUrl: "/api",
      wsUrl: `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/ws`,
    });
  }, []);

  const didConnectRef = useRef(false);

  useEffect(() => {
    if (didConnectRef.current) {
      return;
    }

    didConnectRef.current = true;
    store.connect();

    return () => {
      store.disconnect();
      didConnectRef.current = false;
    };
  }, [store]);

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

export function useClientStore(): ClientStore {
  const store = useContext(StoreContext);

  if (store === null) {
    throw new Error("StoreProvider is missing");
  }

  return store;
}

export function useClientStoreState() {
  const store = useClientStore();
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    return store.subscribe(() => {
      setState(store.getState());
    });
  }, [store]);

  return state;
}
