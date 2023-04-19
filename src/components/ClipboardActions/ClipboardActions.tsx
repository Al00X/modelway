import { ExpandButton } from '@/components/ExpandButton/ExpandButton';
import { clipboardGet, clipboardSet } from '@/services/clipboard';

export const ClipboardActions = (props: {
  className?: string;
  onCopy: (fn: (val: any) => void) => void;
  onPaste: (fn: () => string) => void;
  copyText?: string;
  pasteText?: string;
}) => {
  return (
    <div className={`flex text-xs bg-gray-800 p-1.5 px-3 rounded-tr-lg rounded-tl-lg ${props.className ?? ''}`}>
      <ExpandButton
        icon={`copy`}
        iconSize={`0.875rem`}
        expandWidth={`2.5rem`}
        onClick={() => {
          props.onCopy(clipboardSet);
        }}
      >
        {props.copyText ?? 'COPY'}
      </ExpandButton>
      <ExpandButton
        className={`pl-1`}
        icon={`paste`}
        iconSize={`0.875rem`}
        expandWidth={`2.5rem`}
        onClick={() => {
          props.onPaste(clipboardGet);
        }}
      >
        {props.pasteText ?? 'PASTE'}
      </ExpandButton>
    </div>
  );
};
