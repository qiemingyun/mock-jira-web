import styled from '@emotion/styled';
import { Input } from 'antd';
import { useState } from 'react';
import { useAddBoard, useBoardQueryKey } from '../../utils/board';
import { useProjectIdInUrl } from '../../utils/group';

export const CreateBoard = () => {
  const [name, setName] = useState('');
  const projectId = useProjectIdInUrl();
  const { mutateAsync: addBoard } = useAddBoard(useBoardQueryKey());

  const submit = async () => {
    setName('');
    await addBoard({ name, projectId });
  };

  return (
    <Container>
      <Input
        size="large"
        placeholder="Please input a title for the new board"
        onPressEnter={submit}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </Container>
  );
};

export const Container = styled.div`
  min-width: 15rem;
  border-radius: 6px;
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
  padding: 0%.7re, 0.7rem 1rem;
  margin-right: 1.5rem;
`;
