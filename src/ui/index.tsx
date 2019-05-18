import { ipcRenderer } from 'electron';
import React, { FunctionComponent } from 'react';
import { render } from 'react-dom';
import { RpcProvider } from 'worker-rpc';

import { LoginProvider, useLoginState } from './Login';
import { LoginForm } from './LoginForm';
import { RpcContextProvider } from './RpcProvider';

const rpc = new RpcProvider(payload => ipcRenderer.send('rpc', payload));
ipcRenderer.on('rpc', (_: any, payload: any) => rpc.dispatch(payload));

const App: FunctionComponent = () => {
    const { valid, error, submitting, repositories } = useLoginState();

    if (!valid) {
        return <LoginForm submitting={submitting} error={error} />;
    }

    return (
        <div>
            <ul>
                {repositories.map(function(repository) {
                    return <li key={repository}>{repository}</li>;
                })}
            </ul>
        </div>
    );
};

const root = document.getElementById('root');
render(
    <RpcContextProvider value={rpc}>
        <LoginProvider>
            <App />
        </LoginProvider>
    </RpcContextProvider>,
    root
);
