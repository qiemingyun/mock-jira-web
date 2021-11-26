import { useQuery } from 'react-query';
import { Organization } from '../types/organization';
import { useHttp } from './http';

export const useOrganization = (param?: Partial<Organization>) => {
  const client = useHttp();

  return useQuery<Organization[]>(['organization', param], () =>
    client('api/organization/list', {})
  );
};
