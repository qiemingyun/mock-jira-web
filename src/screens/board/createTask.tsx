import { Card, Input } from 'antd';
import { useEffect, useState } from 'react';
import { useTaskQueryKey } from '../../utils/board';
import { useProjectIdInUrl } from '../../utils/group';
import { useAddTask } from '../../utils/task';

export const CreateTask = ({ boardId }: { boardId: number }) => {
  const [name, setName] = useState('');
  const { mutateAsync: addTask } = useAddTask(useTaskQueryKey());
  const projectId = useProjectIdInUrl();
  const [inputMode, setInputMode] = useState(false);

  const submit = async () => {
    setInputMode(false);
    setName('');
    await addTask({ projectId, name, boardId });
  };

  const toggle = () => setInputMode((mode) => !mode);

  useEffect(() => {
    if (!inputMode) {
      setName('');
    }
  }, [inputMode]);

  if (!inputMode) {
    return <div onClick={toggle}>+ Create an event</div>;
  }

  return (
    <Card>
      <Input
        onBlur={toggle}
        placeholder="Things need to be done"
        autoFocus={true}
        onPressEnter={submit}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </Card>
  );
};
