import { QueryKey, useQueryClient } from 'react-query';
import { Task } from '../types/task';
import { reorder, reorderTask } from './reorder';

export const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old?: any[]) => any[]
) => {
  const queryClient = useQueryClient();
  return {
    onSuccess: () => {
      const qk = queryKey as unknown[];
      const key = qk[0] as string;
      queryClient.invalidateQueries(key);
      queryClient.removeQueries(key, { inactive: true });
    },
    async onMutate(target: any) {
      const previousItems = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old?: any[]) => {
        target.pin = target.pin ? 1 : 0;
        console.log('onMutate_queryKey, ', queryKey);
        console.log('onMutate_target, ', target);
        console.log('onMutate_old, ', old);
        return callback(target, old);
      });
      return { previousItems };
    },
    onError(error: any, newItem: any, context: any) {
      queryClient.setQueryData(queryKey, context.previousItems);
    },
  };
};

export const useDeleteConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) =>
      old?.filter((item) => item.projectId !== target.projectId) || []
  );

export const useEditConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) =>
      old?.map((item) =>
        item.projectId === target.projectId ? { ...item, ...target } : item
      ) || []
  );

export const useEditTaskConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) =>
      old?.map((item) =>
        item.id === target.id ? { ...item, ...target } : item
      ) || []
  );

export const usePinConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) =>
      old?.map((item) =>
        item.projectId === target.projectId ? { ...item, ...target } : item
      ) || []
  );

export const useAddConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => (old ? [...old, target] : []));

export const useReorderBoardConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => reorder({ list: old, ...target }));

export const useReorderTaskConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => {
    console.log('list,target,', target);
    console.log('list,old,', old);
    const orderedList = reorderTask({ list: old, ...target }) as Task[];
    console.log('list,orderedList,', orderedList);
    const map = orderedList.map((item) =>
      item.id === target.fromId ? { ...item, boardId: target.toBoardId } : item
    );
    console.log('list,orderedList,map,', map);
    return map;
  });
