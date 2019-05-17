import { app, BrowserWindow, ipcMain } from 'electron';
import { RpcProvider } from 'worker-rpc';

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    win.loadURL('http://localhost:9000');

    const rpc = new RpcProvider(payload => win.webContents.send('rpc', payload));
    ipcMain.on('rpc', (_: any, payload: any) => rpc.dispatch(payload));

    rpc.registerRpcHandler('hello', (msg?: string) => `hello from the server: ${msg}`);
}

app.on('ready', createWindow);
