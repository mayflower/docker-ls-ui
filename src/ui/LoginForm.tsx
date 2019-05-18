import React from 'react';
import { useLoginState } from './Login';
import { Button, Message, Form, Container } from 'semantic-ui-react';

export function LoginForm({ error, submitting }: { error?: boolean; submitting?: boolean }) {
    const { login } = useLoginState();
    return (
        <Container style={{ marginTop: '50px' }}>
            <h1>Docker Registry</h1>
            <p>Enter details of your Docker registry</p>
            <Form
                error={error}
                loading={submitting}
                onSubmit={e => {
                    e.preventDefault();
                    const fields = (e.target as HTMLFormElement).elements as any;
                    login(fields.username.value, fields.password.value, fields.endpoint.value);
                }}
            >
                <Message error header="Rofllolnope" content="You're not allowed to do this" />
                <Form.Field>
                    <label>Endpoint</label>
                    <input placeholder="Docker registry URL" name="endpoint" />
                </Form.Field>
                <Form.Field>
                    <label>Username</label>
                    <input name="username" />
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <input type="password" name="password" />
                </Form.Field>
                <Button type="submit">OK</Button>
            </Form>
        </Container>
    );
}
