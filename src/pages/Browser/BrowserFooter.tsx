import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { DataState } from '@/states/Data';
import { Icon } from '@/components/Icon/Icon';
import { ModelType } from '@/interfaces/models.interface';

export const BrowserFooter = (props: { filteredListLength: number | undefined; selectedCategory?: ModelType }) => {
  const [atomList] = useAtom(DataState.processedList);
  const atomModelsCount = useAtomValue(DataState.modelCountsByCategory);
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
      className={`sticky bottom-0 w-full flex items-center py-2 px-3 text-xs bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-lg text-gray-50 gap-9 z-10`}
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
      <span className={`opacity-70`}>Checkpoints: {atomModelsCount.Checkpoint ?? 0}</span>
      <span className={`opacity-70`}>Hypernetworks: {atomModelsCount.Hypernetwork ?? 0}</span>
      <span className={`opacity-70`}>LORA: {atomModelsCount.LORA ?? 0}</span>
      <span className={`opacity-70`}>Embeddings: {atomModelsCount.TextualInversion ?? 0}</span>
      <span className={`opacity-90`}>Total: {atomList.length ?? 0}</span>
      <div className={`w-0`}>{/* SpaceLaces Vaultage 2 */}</div>
    </div>
  );
};
