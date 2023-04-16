import { Loader as LoaderMantine } from '@mantine/core';

export const Loader = (props: { className?: string }) => {
  return <LoaderMantine className={`h-full loader stroke-white ${props.className ?? ''}`} variant={`oval`} />;
};
