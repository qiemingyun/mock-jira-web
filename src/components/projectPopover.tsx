import styled from '@emotion/styled';
import { Divider, List, Popover, Typography } from 'antd';
import { useFavroites, useProjectModal, useProjects } from '../utils/project';
import { ButtonNoPadding } from './lib';

export const ProjectPopover = () => {
  const { open } = useProjectModal();
  const { data: projects, refetch } = useProjects();
  const { data: favorites } = useFavroites();
  const pinnedProjects = projects?.filter((project) =>
    favorites?.find(
      (favorite) =>
        favorite.projectId === project.projectId && favorite.pin === 1
    )
  );

  const content = (
    <ContentContainer>
      <Typography.Text type={'secondary'}>Favorite Projects</Typography.Text>
      <List>
        {pinnedProjects?.map((project) => (
          <List.Item key={project.projectId}>
            <List.Item.Meta title={decodeURI(project.projectName)} />
          </List.Item>
        ))}
      </List>
      <Divider />
      <ButtonNoPadding onClick={open} type={'link'}>
        Create Project
      </ButtonNoPadding>
    </ContentContainer>
  );

  return (
    <Popover
      placement={'bottom'}
      content={content}
      onVisibleChange={() => refetch()}
    >
      <h2>Projects</h2>
    </Popover>
  );
};

const ContentContainer = styled.div`
  min-width: 30rem;
`;
