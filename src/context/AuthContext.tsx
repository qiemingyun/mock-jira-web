import React, { ReactNode } from 'react';
import * as auth from '../AuthProvider';
import { FullPageLoading } from '../components/lib';
import { User } from '../types/user';
import { useMount } from '../utils';
import { http } from '../utils/http';
import { useAsync } from '../utils/useAsync';

interface AuthForm {
  username: string;
  password: string;
}

const initUser = async () => {
  let user: User | null = null;
  await http('api/user/info', {}).then((res) => (user = res));
  return user;
};

const AuthContext = React.createContext<
  | {
      user: User | null;
      register: (form: AuthForm) => Promise<void>;
      login: (form: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    isLoading,
    isIdle,
    run,
    setData: setUser,
  } = useAsync<User | null>();
  const register = (form: AuthForm) => auth.register(form).then(setUser);
  const login = (form: AuthForm) => auth.login(form).then(setUser);
  const logout = () => auth.logout().then(setUser);

  useMount(() => {
    run(initUser());
  });

  if (isIdle || isLoading) {
    return <FullPageLoading />;
  }

  return (
    <AuthContext.Provider
      children={children}
      value={{ user, login, register, logout }}
    />
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
