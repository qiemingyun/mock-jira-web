import { useTasks, useTaskTypes } from '../../utils/task';
import taskIcon from '../../assets/task.svg';
import bugIcon from '../../assets/bug.svg';
import { Task } from '../../types/task';
import {
  useBoardQueryKey,
  useDeleteBoard,
  useTaskModal,
  useTaskSearchParam,
} from '../../utils/board';
import { Button, Card, Dropdown, Menu, Modal } from 'antd';
import { Mark } from '../../components/mark';
import styled from '@emotion/styled';
import { Board } from '../../types/board';
import React from 'react';
import { Container } from './createBoard';
import { Row } from '../../components/lib';
import { Drag, Drop, DropChild } from '../../components/dragAndDrop';
import { CreateTask } from './createTask';

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;
  if (!name) {
    return null;
  }
  return <img alt={'task-icon'} src={name === 'task' ? taskIcon : bugIcon} />;
};

const TaskCard = ({ task }: { task: Task }) => {
  const { startEdit } = useTaskModal();
  const { name: keyword } = useTaskSearchParam();
  return (
    <Card
      onClick={() => startEdit(task.id)}
      style={{ marginBottom: '0.5rem', cursor: 'pointer' }}
      key={task.id}
    >
      <p>
        <Mark keyword={keyword} name={decodeURI(task.name)} />
      </p>
      <TaskTypeIcon id={task.typeId} />
    </Card>
  );
};

export const BoardColumn = React.forwardRef<HTMLDivElement, { board: Board }>(
  ({ board, ...props }, ref) => {
    const { data: allTasks } = useTasks(useTaskSearchParam());
    const tasks = allTasks?.filter((task) => task.boardId === board.id);
    return (
      <Container {...props} ref={ref}>
        <Row between={true}>
          <h3>{decodeURI(board.name)}</h3>
          <More board={board} key={board.id} />
        </Row>
        <TaskContainer>
          <Drop
            type={'ROW'}
            direction={'vertical'}
            droppableId={String(board.id)}
          >
            <DropChild style={{ minHeight: '1rem' }}>
              {tasks?.map((task, taskIndex) => (
                <Drag
                  key={task.id}
                  index={taskIndex}
                  draggableId={'task' + task.id}
                >
                  <div>
                    <TaskCard key={task.id} task={task} />
                  </div>
                </Drag>
              ))}
            </DropChild>
          </Drop>
          <CreateTask boardId={board.id} />
        </TaskContainer>
      </Container>
    );
  }
);

const More = ({ board }: { board: Board }) => {
  const { mutateAsync } = useDeleteBoard(useBoardQueryKey());
  const startDelete = () => {
    Modal.confirm({
      okText: 'Confirm',
      cancelText: 'Cancel',
      title: 'Are you sure that you want to delete the board?',
      onOk() {
        return mutateAsync({ id: board.id });
      },
    });
  };
  const overlay = (
    <Menu>
      <Menu.Item>
        <Button type={'link'} onClick={startDelete}>
          Delete
        </Button>
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={overlay}>
      <Button type="link">...</Button>
    </Dropdown>
  );
};

const TaskContainer = styled.div`
  overflow: scroll;
  flex: 1;

  ::-webkit-scrollbar {
    display: none;
  }
`;
