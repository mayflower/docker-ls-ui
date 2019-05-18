import React, { useContext } from 'react';
import { RpcContext } from './RpcProvider';

interface State {
    username: string;
    password: string;
    endpoint: string;
    valid: boolean;
    error?: string;
    submitting?: boolean;
    repositories: any[];
}

interface ContextValue {
    state: State;
    setState(state: State): void;
}

const LoginContext = React.createContext<ContextValue | null>(null);

export function LoginProvider(props: any) {
    const [state, setState] = React.useState({
        username: '',
        password: '',
        endpoint: '',
        valid: false,
        repositories: [],
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
                    repositories: result.repositories,
                });
            })
            .catch(e =>
                ctx.setState({ ...ctx.state, valid: false, error: String(e), submitting: false, repositories: [] })
            );
    }

    return {
        ...ctx.state,
        login,
    };
}
