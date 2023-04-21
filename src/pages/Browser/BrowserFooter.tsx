import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { DataState } from '@/states/Data';
import { Icon } from '@/components/Icon/Icon';

export const BrowserFooter = (props: { filteredListLength: number | undefined }) => {
  const [atomList] = useAtom(DataState.processedList);
  const [missingFilesList, setMissingFilesList] = useState<{ name: string; vae: boolean; config: boolean }[]>([]);

  useEffect(() => {
    setMissingFilesList(
      atomList
        .filter((t) => t.computed.hasVAE === 'missing' || t.computed.hasConfig === 'missing')
        .map((t) => ({
          name: t.computed.name,
          vae: t.computed.hasVAE === 'missing',
          config: t.computed.hasConfig === 'missing',
        })),
    );
  }, [atomList]);

  return (
    <div
      className={`sticky bottom-0 w-full flex items-center py-2 px-3 text-sm bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-lg text-gray-50 gap-12 z-10`}
    >
      {missingFilesList.length > 0 && (
        <div
          className={`inline-flex items-center text-error gap-2 font-semibold`}
          title={missingFilesList.map((t) => `${t.name}:${t.vae ? ' VAE' : ''}${t.config ? ' Config' : ''}`).join('\n')}
        >
          <Icon icon={`warning`} size={'1.25rem'} className={`text-error`} />
          <p>There are some missing files, hover to see the details</p>
        </div>
      )}
      <div className={`ml-auto`}>{/* SpaceLaces */}</div>
      <span className={``}>Filtered: {props.filteredListLength ?? 0}</span>
      <span className={``}>Total: {atomList.length ?? 0}</span>
      <div className={`w-0`}>{/* SpaceLaces Vaultage 2 */}</div>
    </div>
  );
};
