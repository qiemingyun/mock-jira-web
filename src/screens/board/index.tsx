import styled from '@emotion/styled';
import { Spin } from 'antd';
import { useCallback } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Drag, Drop, DropChild } from '../../components/dragAndDrop';
import { ScreenContainer } from '../../components/lib';
import { Profiler } from '../../components/profiler';
import { useDocumentTitle } from '../../utils';

import {
  useBoardQueryKey,
  useBoards,
  useBoardSearchParams,
  useReorderBoard,
  useTaskQueryKey,
  useTaskSearchParam,
} from '../../utils/board';
import { useProjectInUrl } from '../../utils/group';
import { useReorderTask, useTasks } from '../../utils/task';
import { BoardColumn } from './boardColumn';
import { CreateBoard } from './createBoard';
import { SearchPanel } from './searchPanel';
import { TaskModal } from './taskModal';

export const BoardScreen = () => {
  useDocumentTitle('Board List');

  const { data: currentProject } = useProjectInUrl();
  const { data: boards, isLoading: boardIsLoading } = useBoards(
    useBoardSearchParams()
  );
  const { isLoading: taskIsLoading } = useTasks(useTaskSearchParam());
  const isLoading = taskIsLoading || boardIsLoading;

  const onDragEnd = useDragEnd();
  return (
    <Profiler id="BoardPage">
      <DragDropContext onDragEnd={onDragEnd}>
        <ScreenContainer>
          <h1>
            {currentProject ? decodeURI(currentProject.projectName) : ''} Board
          </h1>
          <SearchPanel />
          {isLoading ? (
            <Spin size="large" />
          ) : (
            <ColumnContainer>
              <Drop
                type="COLUMN"
                direction={'horizontal'}
                droppableId={'board'}
              >
                <DropChild style={{ display: 'flex' }}>
                  {boards?.map((board, index) => (
                    <Drag
                      key={board.id}
                      draggableId={'board' + board.id}
                      index={index}
                    >
                      <BoardColumn board={board} key={board.id} />
                    </Drag>
                  ))}
                </DropChild>
              </Drop>
              <CreateBoard />
            </ColumnContainer>
          )}
          <TaskModal />
        </ScreenContainer>
      </DragDropContext>
    </Profiler>
  );
};

const useDragEnd = () => {
  const { data: boards } = useBoards(useBoardSearchParams());
  const { mutate: reorderBoard } = useReorderBoard(useBoardQueryKey());
  const { mutate: reorderTask } = useReorderTask(useTaskQueryKey());
  const { data: allTasks = [] } = useTasks(useTaskSearchParam());
  return useCallback(
    ({ source, destination, type }: DropResult) => {
      if (!destination) {
        return;
      }
      if (type === 'COLUMN') {
        const fromId = boards?.[source.index].id;
        const toId = boards?.[destination.index].id;
        if (!fromId || !toId || fromId === toId) {
          return;
        }
        reorderBoard({ fromId, referenceId: toId });
      }
      if (type === 'ROW') {
        const fromBoardId = +source.droppableId;
        const toBoardId = +destination.droppableId;
        const fromTask = allTasks.filter(
          (task) => task.boardId === fromBoardId
        )[source.index];
        const toTask = allTasks.filter((task) => task.boardId === toBoardId)[
          destination.index
        ];

        if (fromTask?.id === toTask?.id) {
          return;
        }
        reorderTask({
          fromId: fromTask?.id,
          referenceId: toTask?.id,
          fromBoardId,
          toBoardId,
        });
      }
    },
    [boards, reorderBoard, allTasks, reorderTask]
  );
};

export const ColumnContainer = styled.div`
  display: 'flex';
  overflow-x: scroll;
  flex: 1;
`;
