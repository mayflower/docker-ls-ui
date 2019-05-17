import React, { FunctionComponent } from 'react';
import { render } from 'react-dom';
import { ipcRenderer } from 'electron';
import { RpcProvider } from 'worker-rpc';

const rpc = new RpcProvider(payload => ipcRenderer.send('rpc', payload));
ipcRenderer.on('rpc', (_: any, payload: any) => rpc.dispatch(payload));

const App: FunctionComponent = () => (
    <div>
        Hello world!
        <button onClick={async () => console.log(await rpc.rpc('hello', 'from client'))}>Send</button>
    </div>
);

const root = document.getElementById('root');
render(<App />, root);
