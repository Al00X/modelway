import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Modal } from '@/components/Modal/Modal';

export const ChangelogDialog = (props: { open: boolean; onClose: () => void }) => {
  const [text, setText] = useState<string | undefined>();
  const [isAtTop, setIsAtTop] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios
      .get<string>(`/changelog.txt`)
      .then((res) => {
        setText(res.data);
      })
      .catch((e) => {
        console.error('Changelog fetch failed: ', e);
      });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if ((wrapperRef.current?.scrollHeight ?? 0) > (wrapperRef.current?.clientHeight ?? 0)) {
        wrapperRef.current!.scrollTo({ top: wrapperRef.current!.scrollHeight });
      } else {
        setIsAtTop(true);
      }
    }, 1);
  }, [text, props.open]);

  return (
    <Modal
      withCloseButton
      title={`Changelog`}
      width={`30rem`}
      height={`70vh`}
      open={props.open}
      onClose={props.onClose}
    >
      <div className={`flex flex-col bg-gray-800 overflow-hidden p-4 rounded-xl mt-4 relative h-full`}>
        <div
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.3), transparent)' }}
          className={`transition-all duration-200 absolute top-0 left-0 right-0 h-24 pointer-events-none ${
            isAtTop ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {/* I'm your Shadow */}
        </div>
        <div
          ref={wrapperRef}
          className={`overflow-auto w-full h-full whitespace-pre font-mono font-medium opacity-90`}
          onScroll={() => {
            setIsAtTop(wrapperRef.current?.scrollTop < 20);
          }}
        >
          {text}
        </div>
      </div>
    </Modal>
  );
};
