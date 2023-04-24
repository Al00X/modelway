import path from 'node:path';
import { useAtom } from 'jotai';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useForceUpdate } from '@mantine/hooks';
import { Item } from '@/components/Item/Item';
import { FileInput } from '@/components/FileInput/FileInput';
import { MiniSwitch } from '@/components/MiniSwitch/MiniSwitch';
import { SettingsState, UserPaths } from '@/states/Settings';
import { ModelType } from '@/interfaces/models.interface';
import { Separator } from '@/components/Separator/Separator';

export interface UserPathsFormElement {
  export: () => UserPaths | null;
}

export const UserPathsForm = forwardRef<
  UserPathsFormElement,
  {
    className?: string;
  }
>((props, ref) => {
  const [atomUserPaths, setAtomUserPaths] = useAtom(SettingsState.userPaths);
  const [paths, setPaths] = useState<
    Partial<{ [key in ModelType]: { label: string; autoValue?: string; manualValue?: string; isAuto: boolean } }>
  >({
    Checkpoint: { label: 'Models', isAuto: true },
    LORA: { label: 'LORAs', isAuto: true },
    Hypernetwork: { label: 'Hypernetworks', isAuto: true },
    TextualInversion: { label: 'Embeddings', isAuto: true },
  });
  const [clientPath, setClientPath] = useState('');

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    // Populate auto values
    if (clientPath === '') return;

    paths.Checkpoint!.autoValue = path.join(clientPath, 'models', 'Stable-diffusion');
    paths.LORA!.autoValue = path.join(clientPath, 'models', 'Lora');
    paths.Hypernetwork!.autoValue = path.join(clientPath, 'models', 'hypernetworks');
    paths.TextualInversion!.autoValue = path.join(clientPath, 'embeddings');
    forceUpdate();
  }, [clientPath, forceUpdate]);

  useEffect(() => {
    paths.Checkpoint!.autoValue = atomUserPaths.Checkpoint;
    paths.Checkpoint!.manualValue = atomUserPaths.Checkpoint;
    paths.Hypernetwork!.autoValue = atomUserPaths.Hypernetwork;
    paths.Hypernetwork!.manualValue = atomUserPaths.Hypernetwork;
    paths.LORA!.autoValue = atomUserPaths.LORA;
    paths.LORA!.manualValue = atomUserPaths.LORA;
    paths.TextualInversion!.autoValue = atomUserPaths.TextualInversion;
    paths.TextualInversion!.manualValue = atomUserPaths.TextualInversion;
    for (const i of atomUserPaths.manual ?? []) {
      paths[i]!.isAuto = false;
    }
    setClientPath(atomUserPaths.Client ?? '');
    // forceUpdate();
  }, []);

  useImperativeHandle(ref, () => ({
    export: () => {
      let isValid = false;
      const mappedPaths = Object.entries(paths).reduce((pre, cur) => {
        const value = cur[1].isAuto ? cur[1].autoValue : cur[1].manualValue;

        if (value && value !== '') {
          isValid = true;
        }

        return {
          ...pre,
          [cur[0]]: value,
        };
      }, {} as any);

      if (!isValid) return null;

      return {
        Client: clientPath,
        Checkpoint: mappedPaths.Checkpoint,
        LORA: mappedPaths.LORA,
        Hypernetwork: mappedPaths.Hypernetwork,
        TextualInversion: mappedPaths.TextualInversion,
        manual: Object.entries(paths)
          .filter(([key, value]) => !value.isAuto)
          .map(([key, value]) => key) as any[],
      };
    },
  }));

  return (
    <div className={`flex flex-col w-full ${props.className ?? ''}`}>
      <p className={`text-base opacity-90`}>
        By choosing a client folder, other fields are populated automatically. If you want to select folders manually,
        you can skip client selection and switch the desired fields to manual mode to browse each folder individually.
      </p>
      <Separator className={`mt-7 mb-9`} />
      <Item label={`Stable Diffusion Client`}>
        <span className={`absolute -top-3.5 left-0 text-xs opacity-30`}>OPTIONAL</span>
        <FileInput placeholder={`SD Client Folder Path...`} value={clientPath} onValue={setClientPath} />
        <span className={`absolute text-xs left-0 -bottom-6 opacity-60`}>Only Automatic1111 is supported</span>
      </Item>
      <Separator className={`mt-16 mb-4 opacity-40`} />
      {Object.values(paths).map((item) => (
        <Item
          className={`mt-4`}
          labelClassName={`w-32`}
          key={item.label}
          label={item.label}
          startEl={
            <MiniSwitch
              className={`w-11 h-9 p-2 border-gray-600 bg-gray-800`}
              activeClassName={`bg-white text-black`}
              value={item.isAuto}
              trueIcon={`lock`}
              falseIcon={`unlock`}
              trueTitle={`Automatic`}
              falseTitle={`Manual`}
              onValue={(e) => {
                item.isAuto = e;
                forceUpdate();
              }}
            />
          }
        >
          <FileInput
            placeholder={`${item.label} Folder Path....`}
            readonly={item.isAuto}
            value={item.isAuto ? item.autoValue : item.manualValue}
            onValue={(e) => {
              if (!item.isAuto) {
                item.manualValue = e;
                forceUpdate();
              }
            }}
          />
        </Item>
      ))}
    </div>
  );
});
