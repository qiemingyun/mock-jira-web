import { Button, Modal, List } from 'antd';
import { useState } from 'react';
import { Row, ScreenContainer } from '../../components/lib';
import { Group } from '../../types/group';
import { Task } from '../../types/task';
import {
  useProjectInUrl,
  useGroups,
  useGroupSearchParams,
  useDeleteGroup,
  useGroupQueryKey,
} from '../../utils/group';
import { CreateTaskGroup } from './createTaskGroup';

export const TaskGroupScreen = () => {
  const { data: currentProject } = useProjectInUrl();
  const { data: groups } = useGroups(useGroupSearchParams());
  const { mutate: deleteGroup } = useDeleteGroup(useGroupQueryKey());
  const [groupCreateOpen, setGroupCreateOpen] = useState(false);

  const confirmDeleteGroup = (taskGroup: Group) => {
    Modal.confirm({
      title: `Are you sure that you want to delete the task group: ${decodeURI(
        taskGroup.name
      )}?`,
      content: 'Click confirm to delete',
      okText: 'Confirm',
      onOk() {
        deleteGroup({ id: taskGroup.id });
      },
    });
  };

  return (
    <ScreenContainer>
      <Row between={true}>
        <h1>
          {currentProject ? decodeURI(currentProject?.projectName) : ''} Task
          Group
        </h1>
        <Button onClick={() => setGroupCreateOpen(true)} type={'link'}>
          Create A Task Group
        </Button>
      </Row>
      <List
        style={{ overflow: 'scroll' }}
        dataSource={groups}
        itemLayout={'vertical'}
        renderItem={(group) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Row between={true}>
                  <span>{decodeURI(group.name)}</span>
                  <Button
                    onClick={() => confirmDeleteGroup(group)}
                    type={'link'}
                  >
                    Delete
                  </Button>
                </Row>
              }
              // description={
              //   <div>
              //     <div>Start time: </div>
              //     <div>End time: </div>
              //   </div>
              // }
            />
            <div>{}</div>
          </List.Item>
        )}
      ></List>
      <CreateTaskGroup
        onClose={() => setGroupCreateOpen(false)}
        visible={groupCreateOpen}
      />
    </ScreenContainer>
  );
};
