import React, { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';

export default function Select<T extends string | number>(props: {
  items: { text: string; value: T }[];
  value?: T;
  onValue?: (e: T | undefined) => void;
  children: any;
}) {
  const [selected, setSelected] = useState(props.value ? props.items.find((x) => props.value === x.value) : undefined);

  useEffect(() => {
    props.onValue ? props.onValue(selected?.value) : null;
  }, [selected]);

  return (
    <div className="w-auto">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <Listbox.Button>{props.children({ selected })}</Listbox.Button>
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className="absolute mt-0.5 max-h-60 w-full overflow-auto rounded-lg bg-gray-800 text-base shadow-lg">
              {props.items.map((item, index) => (
                <Listbox.Option
                  key={item.value}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 px-4 ${
                      item.value === selected?.value ? 'opacity-80 bg-gray-100 bg-opacity-20' : active ? 'bg-gray-700 text-white' : 'text-white'
                    }`
                  }
                  value={item}
                >
                  {({ selected }) => (
                    <div className={`flex items-center`}>
                        <div className={`w-3 h-3 mr-4 relative`}>
                            {selected && <div className={`w-4 h-4 flex items-center justify-center border-2 border-white rounded-full`}>
                                <div className={`w-2 h-2 flex items-center justify-center bg-white rounded-full`}></div>
                            </div>}
                        </div>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{item.text}</span>
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
