import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { RpcProvider } from 'worker-rpc';

import { LoginProvider, useLoginState, LoginContext } from './Login';
import { LoginForm } from './LoginForm';
import { RpcContextProvider } from './RpcProvider';

const rpc = new RpcProvider(payload => ipcRenderer.send('rpc', payload));
ipcRenderer.on('rpc', (_: any, payload: any) => rpc.dispatch(payload));

class App extends Component {
    initialState = {
        tags: [],
    };

    state = this.initialState;

    render() {
        const { valid, error, submitting, repositories } = this.context!.state;

        if (!valid) {
            return <LoginForm submitting={submitting} error={error} />;
        }

        return (
            <>
                <RepositorySelection repositories={repositories} selectRepository={this.selectRepository} />
                <ul>
                    {this.state.tags.map(tag => {
                        return <li key={tag}>{tag}</li>;
                    })}
                </ul>
            </>
        );
    }

    selectRepository = async (repository: string) => {
        const result: { tags: any[] } = await rpc.rpc('tags', {
            url: this.context!.state.endpoint,
            user: this.context!.state.username,
            password: this.context!.state.password,
            repository,
        });
        this.setState({ tags: result.tags });
    };

    static contextType = LoginContext;
    context!: React.ContextType<typeof LoginContext>;
}

App.contextType = LoginContext;

function RepositorySelection({
    repositories,
    selectRepository,
}: {
    repositories: string[];
    selectRepository: Function;
}) {
    return (
        <ul>
            {repositories.map(repository => {
                return (
                    <li key={repository} onClick={() => selectRepository(repository)}>
                        {repository}
                    </li>
                );
            })}
        </ul>
    );
}

const root = document.getElementById('root');
render(
    <RpcContextProvider value={rpc}>
        <LoginProvider>
            <App />
        </LoginProvider>
    </RpcContextProvider>,
    root
);
