import { QueryKey, useMutation, useQuery } from 'react-query';
import { useLocation } from 'react-router';
import { Group } from '../types/group';
import { useHttp } from './http';
import { useAddConfig, useDeleteConfig } from './optimisticOptions';
import { useProject } from './project';

export const useGroups = (param?: Partial<Group>) => {
  const client = useHttp();

  return useQuery<Group[]>(['group', param], () =>
    client('api/group/list', { req: param })
  );
};

export const useAddGroup = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    (params: Partial<Group>) =>
      client('api/group', { req: params, method: 'POST' }),
    useAddConfig(queryKey)
  );
};

export const useDeleteGroup = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    ({ id }: { id: number }) => client(`api/group/${id}`, { method: 'DELETE' }),
    useDeleteConfig(queryKey)
  );
};

export const useProjectIdInUrl = () => {
  const { pathname } = useLocation();
  const id = pathname.match(/projects\/(\d+)/)?.[1];
  return Number(id);
};

export const useProjectInUrl = () => useProject(useProjectIdInUrl());

export const useGroupSearchParams = () => ({ projectId: useProjectIdInUrl() });

export const useGroupQueryKey = () => ['group', useGroupSearchParams()];
