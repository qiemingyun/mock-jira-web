import React from 'react';
import { useOrganization } from '../utils/organization';
import { IdSelect } from './idSelect';

export const OrganizationSelect = (
  props: React.ComponentProps<typeof IdSelect>
) => {
  const { data: organizations } = useOrganization();
  return <IdSelect options={organizations || []} {...props} />;
};
