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
    win.loadURL('http://localhost:9001');

    const rpc = new RpcProvider(payload => win.webContents.send('rpc', payload));
    ipcMain.on('rpc', (_: any, payload: any) => rpc.dispatch(payload));

    rpc.registerRpcHandler('hello', (options?: { url: string; user: string; password: string }) => {
        var spawnSync = require('child_process').spawnSync;
        var result = spawnSync(
            'docker-ls',
            ['repositories', '-r', options!.url, '-u', options!.user, '-p', options!.password, '-j'],
            { encoding: 'utf-8' }
        );

        if (result.stdout && result.stdout.length > 0) {
            return JSON.parse(result.stdout);
        } else {
            return { error: true };
        }
    });

    rpc.registerRpcHandler('tags', (options?: { url: string; user: string; password: string; repository: string }) => {
        var spawnSync = require('child_process').spawnSync;
        var result = spawnSync(
            'docker-ls',
            ['tags', '-r', options!.url, '-u', options!.user, '-p', options!.password, '-j', options!.repository],
            { encoding: 'utf-8' }
        );

        if (result.stdout && result.stdout.length > 0) {
            return JSON.parse(result.stdout);
        } else {
            return { error: true };
        }
    });

    rpc.registerRpcHandler(
        'tag',
        (options?: { url: string; user: string; password: string; repository: string; tag: string }) => {
            var spawnSync = require('child_process').spawnSync;
            var result = spawnSync(
                'docker-ls',
                [
                    'tag',
                    '-r',
                    options!.url,
                    '-u',
                    options!.user,
                    '-p',
                    options!.password,
                    '-j',
                    `${options!.repository}:${options!.tag}`,
                ],
                { encoding: 'utf-8' }
            );

            if (result.stdout && result.stdout.length > 0) {
                return JSON.parse(result.stdout);
            } else {
                console.log(result.stderr);
                return { error: true };
            }
        }
    );
}

app.on('ready', createWindow);
