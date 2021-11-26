import styled from '@emotion/styled';
import { Drawer, Input, Form, Spin, Button } from 'antd';
import { useEffect } from 'react';
import { ErrorBox } from '../../components/lib';
import { Task } from '../../types/task';
import {
  useAddGroup,
  useProjectIdInUrl,
  useGroupQueryKey,
} from '../../utils/group';

export const CreateTaskGroup = (props: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { mutate: addTask, isLoading, error } = useAddGroup(useGroupQueryKey());
  const [form] = Form.useForm();
  const projectId = useProjectIdInUrl();

  const onFinish = async (values: Task) => {
    await addTask({ ...values, projectId });
    props.onClose();
  };

  useEffect(() => {
    form.resetFields();
  }, [form, props.visible]);

  return (
    <Drawer
      visible={props.visible}
      onClose={props.onClose}
      forceRender={true}
      destroyOnClose={true}
      width={'100%'}
    >
      <Container>
        {isLoading ? (
          <Spin size={'large'} />
        ) : (
          <>
            <h1>Create a task</h1>
            <ErrorBox error={error} />
            <Form
              form={form}
              layout={'vertical'}
              style={{ width: '40rem' }}
              onFinish={onFinish}
            >
              <Form.Item
                label={'Name'}
                name={'name'}
                rules={[
                  {
                    required: true,
                    message: 'Please input task name',
                  },
                ]}
              >
                <Input placeholder={'Please input task name'} />
              </Form.Item>

              <Form.Item style={{ textAlign: 'right' }}>
                <Button
                  loading={isLoading}
                  type={'primary'}
                  htmlType={'submit'}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Container>
    </Drawer>
  );
};

const Container = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
