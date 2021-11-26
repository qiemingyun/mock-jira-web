import React from 'react';
import { useGroups, useGroupSearchParams } from '../utils/group';
import { IdSelect } from './idSelect';

export const GroupSelect = (props: React.ComponentProps<typeof IdSelect>) => {
  const { data: groups } = useGroups(useGroupSearchParams());
  return <IdSelect options={groups || []} {...props} />;
};
