import { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Form, Input } from 'antd';
import { LongButton } from '.';
import { useAsync } from '../utils/useAsync';

export const LoginScreen = ({
  onError,
}: {
  onError: (error: Error) => void;
}) => {
  const { login } = useAuth();
  const { isLoading, run } = useAsync();
  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      await run(login(values));
    } catch (e: any) {
      onError(e);
    }
  };
  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        name={'username'}
        rules={[{ required: true, message: 'Please input username' }]}
      >
        <Input placeholder={'username'} type="text" id={'username'} />
      </Form.Item>
      <Form.Item
        name={'password'}
        rules={[{ required: true, message: 'Please input password' }]}
      >
        <Input placeholder={'password'} type="password" id={'password'} />
      </Form.Item>
      <Form.Item>
        <LongButton loading={isLoading} htmlType={'submit'} type={'primary'}>
          Login
        </LongButton>
      </Form.Item>
    </Form>
  );
};
