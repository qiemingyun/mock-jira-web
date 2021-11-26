import { QueryKey, useMutation, useQuery } from 'react-query';
import { useDebounce } from '.';
import { Task } from '../types/task';
import { TaskType } from '../types/taskType';
import { SortProps } from './board';
import { useHttp } from './http';
import {
  useAddConfig,
  useDeleteConfig,
  useEditTaskConfig,
  useReorderTaskConfig,
} from './optimisticOptions';

export const useTasks = (param?: Partial<Task>) => {
  const client = useHttp();
  const debouncedParam = { ...param, name: useDebounce(param?.name, 200) };

  return useQuery<Task[]>(['task', debouncedParam], () =>
    client('api/task/list', { req: debouncedParam })
  );
};

export const useAddTask = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    (params: Partial<Task>) =>
      client('api/task', {
        req: params,
        method: 'POST',
      }),
    useAddConfig(queryKey)
  );
};

export const useTask = (id?: number) => {
  const client = useHttp();
  return useQuery<Task>(['task', { id }], () => client(`api/task/${id}`, {}), {
    enabled: Boolean(id),
  });
};

export const useEditTask = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Task>) =>
      client(`api/task/${params.id}`, {
        method: 'PATCH',
        req: params,
      }),
    useEditTaskConfig(queryKey)
  );
};

export const useDeleteTask = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    ({ id }: { id: number }) =>
      client(`api/task/${id}`, {
        method: 'DELETE',
      }),
    useDeleteConfig(queryKey)
  );
};

export const useReorderTask = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation((params: SortProps) => {
    return client('api/task/reorder', {
      method: 'PATCH',
      req: params,
    });
  }, useReorderTaskConfig(queryKey));
};

export const useTaskTypes = () => {
  const client = useHttp();
  return useQuery<TaskType[]>(['taskTypes'], () =>
    client('api/task/types', {})
  );
};
