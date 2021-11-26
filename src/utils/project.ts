import { useMemo } from 'react';
import { QueryKey, useQuery, useMutation } from 'react-query';
import { Pin } from '../types/pin';
import { Project } from '../types/project';
import { useHttp } from './http';
import {
  useAddConfig,
  useDeleteConfig,
  useEditConfig,
  usePinConfig,
} from './optimisticOptions';
import { useSetUrlSearchParam, useUrlQueryParam } from './url';

export const useFavroites = (param?: Partial<Project>) => {
  const client = useHttp();

  return useQuery<Pin[]>(['project', 'pin'], () =>
    client('api/favorite/list', {})
  );
};

export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();

  return useQuery<Project[]>(['project', param], () =>
    client('api/project/list', { req: param })
  );
};

export const useEditProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation((params: Partial<Project>) => {
    return client(`api/project/${params.projectId}`, {
      method: 'PATCH',
      req: params,
    });
  }, useEditConfig(queryKey));
};

export const usePinProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation((params: Partial<Project>) => {
    return client(`api/favorite/${params.projectId}`, {
      method: 'POST',
      req: params,
    });
  }, usePinConfig(queryKey));
};

export const useAddProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Project>) =>
      client(`api/project`, {
        method: 'POST',
        req: params,
      }),
    useAddConfig(queryKey)
  );
};

export const useDeleteProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({ projectId }: { projectId: number }) =>
      client(`api/project/${projectId}`, {
        method: 'DELETE',
      }),
    useDeleteConfig(queryKey)
  );
};

export const useProject = (id: number) => {
  const client = useHttp();
  return useQuery<Project>(
    ['project', { id }],
    () => client(`api/project/${id}`, {}),
    { enabled: Boolean(id) }
  );
};

export const useProjectSearchParams = () => {
  const [param, setParam] = useUrlQueryParam(['keyword', 'principalId']);
  return [
    useMemo(
      () => ({
        ...param,
        principalId: Number(param.principalId) || undefined,
      }),
      [param]
    ),
    setParam,
  ] as const;
};

export const useProjectQueryKey = () => {
  const [params] = useProjectSearchParams();
  return ['project', params];
};

export const useProjectPinQueryKey = () => {
  return ['project', 'pin'];
};

export const useProjectModal = () => {
  const [{ projectCreate }, setProjectCreate] = useUrlQueryParam([
    'projectCreate',
  ]);

  const [{ editingProjectId }, setEditingProjectId] = useUrlQueryParam([
    'editingProjectId',
  ]);

  const setUrlParams = useSetUrlSearchParam();
  const { data: editingProject, isLoading } = useProject(
    Number(editingProjectId)
  );

  const open = () => setProjectCreate({ projectCreate: true });
  const close = (isRefresh: boolean) => {
    if (isRefresh) {
      setUrlParams({
        projectCreate: '',
        editingProjectId: '',
        principalId: '',
        keyword: '',
      });
    } else {
      setUrlParams({
        projectCreate: '',
        editingProjectId: '',
      });
    }
  };
  const startEdit = (id: number) => {
    setEditingProjectId({ editingProjectId: id });
  };

  return {
    projectModalOpen: projectCreate === 'true' || Boolean(editingProjectId),
    open,
    close,
    startEdit,
    editingProject,
    isLoading,
  };
};
