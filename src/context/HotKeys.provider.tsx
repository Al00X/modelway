import { useHotkeys } from '@mantine/hooks';
import { eventmit } from 'eventmit';

export const HotKeySearchEvent = eventmit();

export const HotKeysProvider = () => {
  useHotkeys([
    [
      'ctrl+F',
      () => {
        HotKeySearchEvent.emit(null);
      },
    ],
  ]);

  return <></>;
};
