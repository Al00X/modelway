import { clipboard } from 'electron';
import { useEffect, useRef, useState } from 'react';
import { Section } from '@/components/Section/Section';
import { Tag } from '@/components/Tag/Tag';
import { openToast } from '@/services/toast';
import { ClipboardActions } from '@/components/ClipboardActions/ClipboardActions';
import { Modal } from '@/components/Modal/Modal';
import { Button } from '@/components/Button/Button';
import Select, { SelectElementType } from '@/components/Select/Select';
import { KeyValue } from '@/interfaces/utils.interface';

export const TagList = (props: {
  label?: string;
  tags?: string[];
  onTags?: (v: string[]) => void;
  className?: string;
  autoCompleteList?: KeyValue<string>[];
}) => {
  const [list, _setList] = useState<string[]>(props.tags ?? []);
  const [input, setInput] = useState('');
  const [toEdit, setToEdit] = useState<string>('');
  const [pastePreviewList, setPastePreviewList] = useState<string[] | undefined>(undefined);
  const inputRef = useRef<SelectElementType>(null);

  function onTagClick(tag: string) {
    clipboard.write({ text: tag });
    openToast('Copied!');
  }
  function onTagRightClick(tag: string) {
    removeTag(tag);
  }
  function onTagDoubleClick(tag: string) {
    setToEdit(tag);
    setInput(tag);
    inputRef.current?.focus();
  }
  function onTagAdd(val?: string) {
    const value = val ?? input;

    if (list.includes(value)) {
      return;
    }
    if (toEdit) {
      editTag(toEdit, value);
      setToEdit('');
      setInput('');
    } else {
      addTag(value);
      setInput('');
    }
  }
  function onClearInput() {
    setInput('');
  }

  function setList(newList: string[]) {
    props.onTags?.(newList);
    _setList(newList);
  }

  function addTag(tag: string) {
    setList([...list, tag]);
  }
  function editTag(tag: string, newValue: string) {
    const index = list.indexOf(tag);
    const newList = [...list];

    newList[index] = newValue;
    setList(newList);
  }
  function removeTag(tag: string) {
    setList(list.filter((x) => x !== tag));
  }

  function createPastePreview(content: string) {
    const preview = content
      // split by \n or ,
      .split(/,|\n/)
      .map((x) =>
        x
          // Replaces urls
          .replaceAll(/[\w#%&+./:=?@~-]{2,256}\.[a-z]{2,4}\b(\/[\w#%&+./:=?@~-]*)?/gi, '')
          // Replace : at the end of a string
          .replaceAll(/(\w\.\n)*:/gi, '')
          .trim(),
      )
      .filter((x) => !!x && x !== '');

    if (preview.length === 0) {
      openToast('Nothing To Paste!');

      return;
    }
    setPastePreviewList(preview);
  }

  function doPastePreviewFromPreview() {
    if (pastePreviewList === undefined) return;
    setList([...list, ...pastePreviewList]);
    setPastePreviewList(undefined);
    openToast('Pasted!');
  }

  // useEffect(() => {
  //   setList([...(props.tags ?? []), ...added].filter((x) => !removed.includes(x)));
  // }, [props.tags, removed, added]);

  useEffect(() => {
    if (input === '') {
      setToEdit('');
    }
  }, [input]);

  return (
    <>
      <Section
        label={props.label}
        className={`w-full ${props.className ?? ''} pb-12`}
        wrapperClass={`max-h-[14rem] gap-1 gap-y-2`}
      >
        {list.map(
          (x, index) =>
            x && (
              <Tag
                key={x}
                tag={x}
                onClick={() => {
                  onTagClick(x);
                }}
                onRightClick={() => {
                  onTagRightClick(x);
                }}
                onDoubleClick={() => {
                  onTagDoubleClick(x);
                }}
              />
            ),
        )}
        <ClipboardActions
          className={`absolute -top-4 right-0`}
          onPaste={(fn) => {
            createPastePreview(fn());
          }}
          onCopy={(fn) => {
            fn(list.join(', '));
          }}
        />
        <div className={`absolute bottom-2 left-1 right-1 flex items-center`}>
          <button
            className={`transition-all outline-0 ml-1 mr-2 overflow-hidden ${input ? 'w-6' : 'w-0'}`}
            onClick={() => {
              onClearInput();
            }}
          >
            X
          </button>
          <Select
            autocomplete
            className={`bg-transparent p-1 outline-0 border-0 w-full min-h-0`}
            ref={inputRef}
            items={props.autoCompleteList ?? []}
            input={input}
            placeholder={'Add new...'}
            offset={10}
            onInput={(e) => {
              setInput(e);
            }}
            onKeyDown={(e) => {
              e.key === 'Enter' ? onTagAdd() : null;
            }}
            onValue={(e) => {
              if ((e?.length ?? 0) > 0) {
                onTagAdd(e![0]);
              }
            }}
          />
          {/*<input*/}
          {/*  ref={inputRef}*/}
          {/*  value={input}*/}
          {/*  className={`bg-transparent p-1 outline-0 w-full`}*/}
          {/*  placeholder={'Add new...'}*/}
          {/*  onInput={(e) => {*/}
          {/*    setInput(e.currentTarget.value);*/}
          {/*  }}*/}
          {/*  onKeyDown={(e) => {*/}
          {/*    e.key === 'Enter' ? onTagAdd() : null;*/}
          {/*  }}*/}
          {/*/>*/}
          <button
            className={`block outline-0 px-2 py-2 text-xs bg-gray-700 h-full rounded-br-lg`}
            onClick={() => {
              onTagAdd();
            }}
          >
            SAVE
          </button>
        </div>
      </Section>
      <Modal
        withCloseButton
        title={`Paste Safety Assurance Agent`}
        className={`z-[6667]`}
        width={`34rem`}
        height={`auto`}
        open={!!pastePreviewList}
        onClose={() => {
          setPastePreviewList(undefined);
        }}
      >
        <p className={`opacity-90 mt-2`}>
          You are going to paste the items below inside <span className={`font-bold underline`}>{props.label}</span>,
          continue?
        </p>
        <div className={`flex flex-wrap mt-7 gap-2`}>
          {pastePreviewList?.map((x) => (
            <Tag key={x} tag={x} />
          ))}
        </div>
        <div className={`flex items-center justify-end gap-4 mt-10`}>
          {/*<Button>CANCEL</Button>*/}
          <Button className={`w-32`} onClick={doPastePreviewFromPreview}>
            PASTE
          </Button>
        </div>
      </Modal>
    </>
  );
};
