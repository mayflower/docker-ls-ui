import React from 'react';
import { useLoginState } from './Login';

export function LoginForm({ error, submitting }: { error?: string; submitting?: boolean }) {
    const { login } = useLoginState();
    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                const fields = (e.target as HTMLFormElement).elements as any;
                login(fields.username.value, fields.pw.value, fields.endpoint.value);
            }}
        >
            {error && <h3>{error}</h3>}
            <label>
                Name
                <input type="text" name="username" />
            </label>
            <label>
                Password <input type="password" name="pw" />
            </label>
            <label>
                Endpoint
                <input type="text" name="endpoint" />
            </label>
            <button type="submit" disabled={submitting}>
                submit
            </button>
        </form>
    );
}
