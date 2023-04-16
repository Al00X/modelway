import { clipboard } from 'electron';
import { useEffect, useRef, useState } from 'react';
import { Section } from '@/components/Section/Section';
import { Tag } from '@/components/Tag/Tag';
import { openToast } from '@/services/toast';
import { clipboardSet } from '@/services/clipboard';

export const TagList = (props: { label?: string; tags?: string[]; className?: string }) => {
  const [list, setList] = useState<string[]>(props.tags ?? []);
  const [input, setInput] = useState('');
  const [toEdit, setToEdit] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

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
  function onTagAdd() {
    if (list.includes(input)) {
      return;
    }
    if (toEdit) {
      editTag(toEdit, input);
      setToEdit('');
      setInput('');
    } else {
      addTag(input);
      setInput('');
    }
  }
  function onCopyAll() {
    clipboardSet(list.join(', '));
  }
  function onClearInput() {
    setInput('');
  }

  function addTag(tag: string) {
    setList([...list, tag]);
  }
  function editTag(tag: string, newValue: string) {
    const index = list.indexOf(tag);

    list[index] = newValue;
  }
  function removeTag(tag: string) {
    setList(list.filter((x) => x !== tag));
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
      <div
        tabIndex={-1}
        role={`button`}
        className={`absolute -top-4 right-0 bg-gray-800 text-sm rounded-lg px-4 py-1 pb-3 cursor-pointer`}
        onClick={() => {
          onCopyAll();
        }}
      >
        COPY ALL
      </div>
      <div className={`absolute bottom-2 left-1 right-1 flex items-center`}>
        <button
          className={`transition-all outline-0 ml-1 mr-2 overflow-hidden ${input ? 'w-6' : 'w-0'}`}
          onClick={() => {
            onClearInput();
          }}
        >
          X
        </button>
        <input
          ref={inputRef}
          value={input}
          className={`bg-transparent p-1 outline-0 w-full`}
          placeholder={'Add new...'}
          onInput={(e) => {
            setInput(e.currentTarget.value);
          }}
          onKeyDown={(e) => {
            e.key === 'Enter' ? onTagAdd() : null;
          }}
        />
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
  );
};
