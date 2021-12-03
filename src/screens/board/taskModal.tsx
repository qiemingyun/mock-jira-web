import { Button, Form, Input, Layout, Modal } from 'antd';
import { useEffect } from 'react';
import { GroupSelect } from '../../components/groupSelect';
import { TaskTypeSelect } from '../../components/taskTypeSelect';
import { UserSelect } from '../../components/userSelect';
import { useTaskModal, useTaskQueryKey } from '../../utils/board';
import { useDeleteTask, useEditTask } from '../../utils/task';

export const TaskModal = () => {
  const [form] = Form.useForm();
  const { editingTaskId, editingTask, close } = useTaskModal();
  const { mutateAsync: editTask, isLoading } = useEditTask(useTaskQueryKey());

  const { mutate: deleteTask } = useDeleteTask(useTaskQueryKey());

  const onCancel = () => {
    close();
    form.resetFields();
  };

  const onOk = async () => {
    await editTask({ ...editingTask, ...form.getFieldsValue() });
    close();
  };

  const startDelete = () => {
    close();
    Modal.confirm({
      okText: 'Confirm',
      cancelText: 'Cancel',
      title: 'Are you sure that you want to delete the task group?',
      onOk() {
        return deleteTask({ id: Number(editingTaskId) });
      },
    });
  };

  useEffect(() => {
    if (editingTask) {
      const taskData = editingTask;
      taskData.name = decodeURI(editingTask.name);
      form.setFieldsValue(taskData);
    }
  }, [form, editingTask]);

  return (
    <Modal
      forceRender={true}
      onCancel={onCancel}
      onOk={onOk}
      okText={'Confirm'}
      cancelText={'Cancel'}
      confirmLoading={isLoading}
      title={'Edit Task'}
      visible={!!editingTask}
    >
      <Form {...layout} initialValues={editingTask} form={form}>
        <Form.Item
          label={'Task Name'}
          name={'name'}
          rules={[{ required: true, message: 'Please input the task name' }]}
        >
          <Input placeholder="Please input the task name" />
        </Form.Item>
        <Form.Item label={'Task Group'} name={'groupId'}>
          <GroupSelect defaultOptionName={'Task Group'} />
        </Form.Item>
        <Form.Item label={'Processor'} name={'processorId'}>
          <UserSelect defaultOptionName={'Processor'} />
        </Form.Item>
        <Form.Item label={'Type'} name={'typeId'}>
          <TaskTypeSelect defaultOptionName={'Type'} />
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'right' }}>
        <Button
          onClick={startDelete}
          style={{ fontSize: '14px' }}
          size={'small'}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
