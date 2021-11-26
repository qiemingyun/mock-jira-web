import styled from '@emotion/styled';
import { Menu } from 'antd';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { BoardScreen } from '../board';
import { TaskGroupScreen } from '../task';

const useRouteType = () => {
  const units = useLocation().pathname.split('/');
  return units[units.length - 1];
};

export const ProjectScreen = () => {
  const routeType = useRouteType();
  return (
    <Container>
      <Aside>
        <Menu mode="inline" selectedKeys={[routeType]}>
          <Menu.Item key="board">
            <Link to={'board'}>Board</Link>
          </Menu.Item>
          <Menu.Item key="task">
            <Link to={'task'}>Task Group</Link>
          </Menu.Item>
        </Menu>
      </Aside>
      <Main>
        <Routes>
          <Route path={'/board'} element={<BoardScreen />} />
          <Route path={'/task'} element={<TaskGroupScreen />} />
          <Route path="/*" element={<Navigate to="board" />} />
        </Routes>
      </Main>
    </Container>
  );
};

const Aside = styled.aside`
  background-color: rgb(244, 245, 247);
  display: flex;
`;

const Main = styled.div`
  box-shadow: -5px 0 5px -5px rgb(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 16rem 1fr;
  width: 100%;
`;
