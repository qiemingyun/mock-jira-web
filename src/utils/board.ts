import { useCallback, useMemo } from 'react';
import { QueryKey, useMutation, useQuery } from 'react-query';
import { Board } from '../types/board';
import { useProjectIdInUrl } from './group';
import { useHttp } from './http';
import {
  useAddConfig,
  useDeleteConfig,
  useReorderBoardConfig,
} from './optimisticOptions';
import { useTask } from './task';
import { useUrlQueryParam } from './url';

export interface SortProps {
  fromId: number;
  referenceId: number;
  fromBoardId?: number;
  toBoardId?: number;
}

export const useBoards = (param?: Partial<Board>) => {
  const client = useHttp();

  return useQuery<Board[]>(['board', param], () => {
    return client('api/board/list', { req: param });
  });
};

export const useAddBoard = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (param: Partial<Board>) =>
      client('api/board', { req: param, method: 'POST' }),
    useAddConfig(queryKey)
  );
};

export const useDeleteBoard = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    ({ id }: { id: number }) => client(`api/board/${id}`, { method: 'DELETE' }),
    useDeleteConfig(queryKey)
  );
};

export const useReorderBoard = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation((param: SortProps) => {
    return client('api/board/reorder', {
      method: 'PATCH',
      req: param,
    });
  }, useReorderBoardConfig(queryKey));
};

export const useBoardSearchParams = () => ({ projectId: useProjectIdInUrl() });

export const useBoardQueryKey = () => ['board', useBoardSearchParams()];

export const useTaskSearchParam = () => {
  const [param, setParam] = useUrlQueryParam([
    'name',
    'typeId',
    'processorId',
    'tagId',
  ]);

  const projectId = useProjectIdInUrl();
  return useMemo(
    () => ({
      projectId,
      typeId: Number(param.typeId) || undefined,
      processorId: Number(param.processorId) || undefined,
      tagId: Number(param.tagId) || undefined,
      name: param.name,
    }),
    [projectId, param]
  );
};

export const useTaskQueryKey = () => ['task', useTaskSearchParam()];

export const useTaskModal = () => {
  const [{ editingTaskId }, setEditingTaskId] = useUrlQueryParam([
    'editingTaskId',
  ]);

  const { data: editingTask, isLoading } = useTask(Number(editingTaskId));
  const startEdit = useCallback(
    (id: number) => {
      setEditingTaskId({ editingTaskId: id });
    },
    [setEditingTaskId]
  );

  const close = useCallback(() => {
    setEditingTaskId({ editingTaskId: '' });
  }, [setEditingTaskId]);
  return {
    editingTaskId,
    editingTask,
    startEdit,
    close,
    isLoading,
  };
};
