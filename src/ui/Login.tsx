import React, { useContext } from 'react';
import { RpcContext } from './RpcProvider';

interface State {
    username: string;
    password: string;
    endpoint: string;
    valid: boolean;
    error: boolean;
    submitting?: boolean;
    repositories: any[];
    tags: any[];
}

export interface ContextValue {
    state: State;
    setState(state: State): void;
}

export const LoginContext = React.createContext<ContextValue | null>(null);

export function LoginProvider(props: any) {
    const [state, setState] = React.useState({
        username: '',
        password: '',
        endpoint: '',
        valid: false,
        error: false,
        repositories: [],
        tags: [],
    });

    const value = React.useMemo(
        () => ({
            state,
            setState,
        }),
        [state]
    );

    return <LoginContext.Provider value={value} {...props} />;
}

export function useLoginState() {
    const context = useContext(LoginContext);
    if (!context) {
        throw new Error('you need a Provider!');
    }
    const rpc = useContext(RpcContext);

    const ctx = context;

    async function login(username: string, password: string, endpoint: string) {
        ctx.setState({ ...ctx.state, submitting: true });
        // async call to console login / any other form of validation
        rpc.rpc<any, { error: any; repositories: any[] }>('hello', { url: endpoint, user: username, password })
            .then(result => {
                if (result.error) {
                    throw new Error(result.error);
                }
                ctx.setState({
                    ...ctx.state,
                    username,
                    password,
                    endpoint,
                    valid: true,
                    submitting: false,
                    error: false,
                    repositories: result.repositories,
                    tags: [],
                });
            })
            .catch(e =>
                ctx.setState({
                    ...ctx.state,
                    valid: false,
                    error: true,
                    submitting: false,
                    repositories: [],
                    tags: [],
                })
            );
    }

    return {
        ...ctx.state,
        login,
    };
}
