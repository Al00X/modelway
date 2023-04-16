import { useAtom } from 'jotai';
import { DataState } from '@/states/Data';

export const BrowserFooter = (props: { filteredListLength: number | undefined }) => {
  const [atomList] = useAtom(DataState.processedList);

  return (
    <div
      className={`sticky bottom-0 w-full flex items-center pt-0.5 pb-1.5 px-3 text-xs bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-lg text-white gap-8`}
    >
      <div className={`ml-auto`}>{/* SpaceLaces */}</div>
      <span className={``}>Filtered: {props.filteredListLength ?? 0}</span>
      <span className={``}>Total: {atomList.length ?? 0}</span>
    </div>
  );
};
