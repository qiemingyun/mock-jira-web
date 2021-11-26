import styled from '@emotion/styled';
import { Button, Drawer, Form, Input, Spin } from 'antd';
import { useEffect } from 'react';
import { ErrorBox } from '../../components/lib';
import { OrganizationSelect } from '../../components/organizationSelect';
import { UserSelect } from '../../components/userSelect';
import {
  useAddProject,
  useEditProject,
  useProjectModal,
  useProjectQueryKey,
} from '../../utils/project';

export const ProjectModal = () => {
  const { projectModalOpen, close, editingProject, isLoading } =
    useProjectModal();
  const useMutateProject = editingProject ? useEditProject : useAddProject;

  const {
    mutateAsync,
    error,
    isLoading: mutateLoading,
  } = useMutateProject(useProjectQueryKey());

  const [form] = Form.useForm();
  const onFinish = (value: any) => {
    mutateAsync({ ...editingProject, ...value, createTime: new Date() });
    form.resetFields();
    close(false);
  };

  const closeModal = () => {
    form.resetFields();
    close(false);
  };

  const title = editingProject ? 'Edit Project' : 'Create Project';

  useEffect(() => {
    if (editingProject) {
      editingProject.projectName = decodeURI(editingProject.projectName);
    }
    form.setFieldsValue(editingProject);
  }, [editingProject, form]);

  return (
    <Drawer
      forceRender={true}
      onClose={closeModal}
      visible={projectModalOpen}
      width={'100%'}
    >
      <Container>
        {isLoading ? (
          <Spin size={'large'} />
        ) : (
          <>
            <h1>{title}</h1>
            <ErrorBox error={error} />
            <Form
              form={form}
              layout={'vertical'}
              style={{ width: '40rem' }}
              onFinish={onFinish}
            >
              <Form.Item
                label={'name'}
                name={'projectName'}
                rules={[
                  { required: true, message: 'Please input project name' },
                ]}
              >
                <Input placeholder={'Please input project name'} />
              </Form.Item>

              <Form.Item
                label={'organization'}
                name={'organizationId'}
                rules={[
                  { required: true, message: 'Please select an organization' },
                ]}
              >
                <OrganizationSelect defaultOptionName={'organization'} />
              </Form.Item>

              <Form.Item
                label={'principal'}
                name={'principalId'}
                rules={[
                  { required: true, message: 'Please select a principal' },
                ]}
              >
                <UserSelect defaultOptionName={'principal'} />
              </Form.Item>

              <Form.Item style={{ textAlign: 'right' }}>
                <Button
                  loading={mutateLoading}
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
