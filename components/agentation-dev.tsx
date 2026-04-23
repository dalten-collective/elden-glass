'use client';

import { Agentation } from 'agentation';

const endpoint = process.env.NEXT_PUBLIC_AGENTATION_ENDPOINT || undefined;

export function AgentationDev() {
  return <Agentation endpoint={endpoint} />;
}
