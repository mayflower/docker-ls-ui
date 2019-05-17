import React from 'react';
import { RpcProvider } from 'worker-rpc';
export const RpcContext = React.createContext<RpcProvider>((null as any) as RpcProvider);
export const { Provider: RpcContextProvider, Consumer: RpcConsumer } = RpcContext;
