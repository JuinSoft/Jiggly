'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

export default function Account() {
  const { user } = useDynamicContext();
  return <div>{user?.email}</div>;
}