import { useCallback } from 'react';
import Input from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { API } from '@/api';

export const FileInput = (props: {
  readonly?: boolean;
  placeholder?: string;
  value?: string;
  onValue?: (e: string) => void;
}) => {
  const browse = useCallback(async () => {
    const result = await API().DialogOpenDir(props.placeholder);

    if (!result.canceled) {
      props.onValue?.(result.filePaths[0]);
    }
  }, [props.onValue]);

  return (
    <div className={`flex items-stretch w-full`}>
      <Input
        className={`rounded-tr-none rounded-br-none text-sm`}
        placeholder={props.placeholder}
        readonly={props.readonly}
        value={props.value}
      />
      <Button
        className={`rounded-tl-none rounded-bl-none text-xs font-bold`}
        disabled={props.readonly}
        onClick={browse}
      >
        BROWSE
      </Button>
    </div>
  );
};
