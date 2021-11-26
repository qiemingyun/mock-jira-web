import { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { Form, Input, Button } from 'antd';
import { LongButton } from '.';
import { useAsync } from '../utils/useAsync';

export const RegisterScreen = ({
  onError,
}: {
  onError: (error: Error) => void;
}) => {
  const { register } = useAuth();
  const { isLoading, run } = useAsync();
  const handleSubmit = async (values: {
    username: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      if (values.password === values.confirmPassword) {
        await run(register(values));
      } else {
        onError(new Error('Inconsistent passwords'));
      }
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
      <Form.Item
        name={'confirmPassword'}
        rules={[{ required: true, message: 'Please confirm password' }]}
      >
        <Input
          placeholder={'confirm password'}
          type="password"
          id={'confirmPassword'}
        />
      </Form.Item>
      <Form.Item>
        <LongButton loading={isLoading} htmlType={'submit'} type={'primary'}>
          Register
        </LongButton>
      </Form.Item>
    </Form>
  );
};
