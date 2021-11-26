import { Dropdown, Modal, Table, TableProps, Menu } from 'antd';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { ButtonNoPadding } from '../../components/lib';
import { Pin } from '../../components/pin';
import { Project } from '../../types/project';
import { User } from '../../types/user';
import { Pin as Favorite } from '../../types/pin';
import { useOrganization } from '../../utils/organization';
import {
  useDeleteProject,
  usePinProject,
  useProjectModal,
  useProjectPinQueryKey,
  useProjectQueryKey,
} from '../../utils/project';

interface ListProps extends TableProps<Project> {
  users: User[];
  favorites: Favorite[];
}

export const List = ({ users, favorites, ...props }: ListProps) => {
  const { mutate } = usePinProject(useProjectPinQueryKey());
  const pinProject = (projectId: number) => (pin: boolean) =>
    mutate({ projectId, pin });

  const { data: organizations } = useOrganization();

  return (
    <Table
      rowKey={'projectId'}
      pagination={false}
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(value, project) {
            return (
              <Pin
                checked={
                  !!favorites?.find(
                    (favorite) =>
                      favorite.projectId === project.projectId &&
                      favorite.pin === 1
                  )
                }
                onCheckedChange={pinProject(project.projectId)}
              />
            );
          },
        },
        {
          title: 'Name',
          render(value, project) {
            return (
              <Link to={String(project.projectId)}>
                {decodeURI(project.projectName)}
              </Link>
            );
          },
        },
        {
          title: 'Principal',
          render(value, project) {
            return (
              <span>
                {users?.find((user) => user.id === project.principalId)?.name ||
                  'unknown'}
              </span>
            );
          },
        },
        {
          title: 'Organization',
          render(value, project) {
            return (
              <span>
                {organizations?.find(
                  (organization) => organization.id === project.organizationId
                )?.name || 'unknown'}
              </span>
            );
          },
        },
        {
          title: 'Create Time',
          render(value, project) {
            return (
              <span>
                {project.createTime
                  ? dayjs(project.createTime).format('DD/MM/YYYY')
                  : 'unknown'}
              </span>
            );
          },
        },
        {
          render(value, project) {
            return <More project={project} />;
          },
        },
      ]}
      {...props}
    />
  );
};

const More = ({ project }: { project: Project }) => {
  const { startEdit } = useProjectModal();
  const editProject = (id: number) => () => startEdit(id);
  const { mutate: deleteProject } = useDeleteProject(useProjectQueryKey());
  const confirmDeleteProject = (project: Project) => {
    Modal.confirm({
      title: `Are you sure that you want to delete the project: ${decodeURI(
        project.projectName
      )}?`,
      content: 'Click confirm to delete',
      okText: 'Confirm',
      onOk() {
        deleteProject({ projectId: project.projectId });
      },
    });
  };

  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item onClick={editProject(project.projectId)} key={'edit'}>
            Edit
          </Menu.Item>
          <Menu.Item
            onClick={() => confirmDeleteProject(project)}
            key={'delete'}
          >
            Delete
          </Menu.Item>
        </Menu>
      }
    >
      <ButtonNoPadding type={'link'}>...</ButtonNoPadding>
    </Dropdown>
  );
};
