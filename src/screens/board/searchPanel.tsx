import { Button, Input } from 'antd';
import { Row } from '../../components/lib';
import { TaskTypeSelect } from '../../components/taskTypeSelect';
import { UserSelect } from '../../components/userSelect';
import { useTaskSearchParam } from '../../utils/board';
import { useSetUrlSearchParam } from '../../utils/url';

export const SearchPanel = () => {
  const searchParam = useTaskSearchParam();
  const setSearchParam = useSetUrlSearchParam();
  const reset = () => {
    setSearchParam({
      typeId: undefined,
      processorId: undefined,
      tagId: undefined,
      name: undefined,
    });
  };

  return (
    <Row marginBottom={4} gap={true}>
      <Input
        style={{ width: '20rem' }}
        placeholder={'Task name'}
        value={searchParam.name}
        onChange={(e) => setSearchParam({ name: e.target.value })}
      />
      <UserSelect
        defaultOptionName={'Processor'}
        value={searchParam.processorId}
        onChange={(value) => setSearchParam({ processorId: value })}
      />
      <TaskTypeSelect
        defaultOptionName={'Type'}
        value={searchParam.typeId}
        onChange={(value) => setSearchParam({ typeId: value })}
      />
      <Button onClick={reset}>Clean filter</Button>
    </Row>
  );
};
