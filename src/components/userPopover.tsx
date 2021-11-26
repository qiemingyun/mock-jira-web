import styled from '@emotion/styled';
import { Typography, List, Divider, Popover } from 'antd';
import { useUsers } from '../utils/user';

export const UserPopover = () => {
  const { data: users, refetch } = useUsers();

  const content = (
    <ContentContainer>
      <Typography.Text type={'secondary'}>Group Members</Typography.Text>
      <List>
        {users?.map((user) => (
          <List.Item key={user.id}>
            <List.Item.Meta title={user.name} />
          </List.Item>
        ))}
      </List>
      <Divider />
    </ContentContainer>
  );

  return (
    <Popover
      onVisibleChange={() => refetch()}
      placement="bottom"
      content={content}
    >
      <h2>Members</h2>
    </Popover>
  );
};

const ContentContainer = styled.div`
  min-width: 30rem;
`;
