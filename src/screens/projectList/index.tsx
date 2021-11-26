import { SearchPanel } from './SearchPanel';
import { List } from './list';
import { useDebounce, useDocumentTitle } from '../../utils';
import { Button } from 'antd';
import { Row, ScreenContainer, ErrorBox } from '../../components/lib';
import {
  useProjectModal,
  useProjects,
  useProjectSearchParams,
  useFavroites,
} from '../../utils/project';
import { useUsers } from '../../utils/user';

export const ProjectListScreen = () => {
  useDocumentTitle('Project List', false);
  const { open } = useProjectModal();
  const [param, setParam] = useProjectSearchParams();
  const { isLoading, error, data: list } = useProjects(useDebounce(param, 200));
  const { data: favorites } = useFavroites();
  const { data: users } = useUsers();

  return (
    <ScreenContainer>
      <Row marginBottom={2} between={true}>
        <h1>Project List</h1>
        <Button style={{ padding: 0 }} onClick={open} type="link">
          Create Project
        </Button>
      </Row>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      <ErrorBox error={error} />
      <List
        loading={isLoading}
        users={users || []}
        favorites={favorites || []}
        dataSource={list || []}
      />
    </ScreenContainer>
  );
};
