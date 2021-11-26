import { useQuery } from 'react-query';
import { User } from '../types/user';
import { useHttp } from './http';

export const useUsers = (param?: Partial<User>) => {
  const client = useHttp();

  return useQuery<User[]>(['api/user', param], () =>
    client('api/user/list', {})
  );
};
