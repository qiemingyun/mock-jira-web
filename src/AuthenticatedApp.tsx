import styled from '@emotion/styled';
import { ButtonNoPadding, Row } from './components/lib';
import { useAuth } from './context/AuthContext';
import { ProjectListScreen } from './screens/projectList';
import { ReactComponent as SoftwareLogo } from './assets/software-logo.svg';
import { Button, Dropdown, Menu } from 'antd';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProjectScreen } from './screens/project';
import { resetRoute } from './utils';
import { ProjectModal } from './screens/projectList/projectModal';
import { ProjectPopover } from './components/projectPopover';
import { UserPopover } from './components/userPopover';

export const AuthenticatedApp = () => {
  return (
    <Container>
      <PageHeader />
      <Main>
        <Routes>
          <Route path="/projects" element={<ProjectListScreen />} />
          <Route path="/projects/:projectId/*" element={<ProjectScreen />} />
          <Route path="/" element={<Navigate to="/projects" />} />
        </Routes>
      </Main>
      <ProjectModal />
    </Container>
  );
};

const PageHeader = () => {
  const { user, logout } = useAuth();
  return (
    <Header between={true}>
      <HeaderLeft gap={true}>
        <ButtonNoPadding type={'link'} onClick={resetRoute}>
          <SoftwareLogo width={'12rem'} color={'rgb(38,132,255)'} />
        </ButtonNoPadding>
        <ProjectPopover />
        <UserPopover />
      </HeaderLeft>
      <HeaderRight>
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key={'logout'}>
                <Button type={'link'} onClick={logout}>
                  logout
                </Button>
              </Menu.Item>
            </Menu>
          }
        >
          <Button type="link" onClick={(e) => e.preventDefault()}>
            Hi, {user?.name}
          </Button>
        </Dropdown>
      </HeaderRight>
    </Header>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr;
  height: 100%;
  overflow: hidden;
`;

const Header = styled(Row)`
  padding: 3.2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const HeaderLeft = styled(Row)``;
const HeaderRight = styled.div``;
const Main = styled.main`
  display: flex;
  overflow: hidden;
`;
