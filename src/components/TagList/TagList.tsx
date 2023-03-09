import Section from '@/components/Section/Section';
import Tag from "@/components/Tag/Tag";
import {clipboard} from "electron";
import {openToast} from "@/services/toast";
import {useEffect, useState} from "react";

export default function TagList(props: { label?: string; tags?: string[]; className?: string }) {
    const [removed, setRemoved] = useState<string[]>([]);
    const [added, setAdded] = useState<string[]>([]);
    const [list, setList] = useState<string[]>([]);
    const [input, setInput] = useState('');

    function onTagClick(tag: string) {
        clipboard.write({ text: tag });
        openToast('Copied!');
    }
    function onTagRightClick(tag: string) {
        setRemoved([...removed, tag]);
    }
    function onTagAdd() {
        if (removed.find(x => x === input)) {
            setRemoved(removed.filter(x => x !== input));
            setInput('');
        } else if (!added.find(x => x === input)) {
            setAdded([...added, input]);
            setInput('');
        }
    }
    function onCopyAll() {
        clipboard.write({ text: list.join(', ') });
        openToast('Copied!');
    }

    useEffect(() => {
        setList([...(props.tags ?? []), ...added].filter(x => !removed.includes(x)));
    }, [props.tags, removed, added])

  return (
    <>
      <Section label={props.label} className={`w-full ${props.className ?? ''} pb-12`} wrapperClass={`max-h-[14rem]`}>
        {list.map(
          (x) =>
            x && (
              <Tag tag={x} onClick={() => onTagClick(x)} onRightClick={() => onTagRightClick(x)} />
            ),
        )}
          <div onClick={() => onCopyAll()} className={`absolute -top-4 right-0 bg-gray-800 text-sm rounded-lg px-4 py-1 pb-3 cursor-pointer`}>
              COPY ALL
          </div>
        <div className={`absolute bottom-0 left-0 right-1 flex items-center`}>
          <input value={input} onInput={(e) => setInput(e.currentTarget.value)} className={`bg-transparent p-1 px-4 pb-3 outline-0 w-full`} placeholder={'Add new...'} />
            <button className={`block outline-0 px-2 py-2 text-xs bg-gray-700 h-full rounded-br-lg`} onClick={() => onTagAdd()}>SAVE</button>
        </div>
      </Section>
    </>
  );
}
