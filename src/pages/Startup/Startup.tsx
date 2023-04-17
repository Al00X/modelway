import path from 'node:path';
import { useLocation } from 'wouter';
import { useCallback, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { useForceUpdate } from '@mantine/hooks';
import { SettingsState } from '@/states/Settings';
import { Item } from '@/components/Item/Item';
import { MiniSwitch } from '@/components/MiniSwitch/MiniSwitch';
import { ModelType } from '@/interfaces/models.interface';
import { FileInput } from '@/components/FileInput/FileInput';
import { Icon } from '@/components/Icon/Icon';
import { Button } from '@/components/Button/Button';

export const Startup = () => {
  const [location, navigate] = useLocation();
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

  const navigateToBrowser = useCallback(() => {
    navigate('/browser');
  }, [navigate]);

  const save = useCallback(() => {
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

    if (!isValid) return;

    setAtomUserPaths({
      Client: clientPath,
      Checkpoint: mappedPaths.Checkpoint,
      LORA: mappedPaths.LORA,
      Hypernetwork: mappedPaths.Hypernetwork,
      TextualInversion: mappedPaths.TextualInversion,
    });
    navigateToBrowser();
  }, [paths, navigateToBrowser, clientPath, setAtomUserPaths]);

  useEffect(() => {
    if (Object.values(atomUserPaths).some((x) => !!x && x !== '')) {
      navigateToBrowser();
    }
  }, []);

  useEffect(() => {
    // Populate auto values
    if (clientPath === '') return;

    paths.Checkpoint!.autoValue = path.join(clientPath, 'models', 'Stable-diffusion');
    paths.LORA!.autoValue = path.join(clientPath, 'models', 'Lora');
    paths.Hypernetwork!.autoValue = path.join(clientPath, 'models', 'hypernetworks');
    paths.TextualInversion!.autoValue = path.join(clientPath, 'embeddings');
    forceUpdate();
  }, [clientPath, forceUpdate]);

  return (
    <div className={`flex flex-col w-full h-full items-center justify-center bg-gray-800`}>
      <div className={`relative w-full flex flex-col items-center justify-center`}>
        <div className={`absolute text-white text-4xl font-bold -top-24`}>
          WELCOME TO{' '}
          <span>
            MODELWA<span className={`opacity-0`}>Y</span>
          </span>
          <Icon className={`absolute -right-5 -top-1`} size={`3.5rem`} icon={'y'} />
        </div>
        <div className={`w-1/2 p-8 rounded-2xl bg-gray-600 flex flex-col`}>
          <p className={`text-lg`}>Please specify the needed folder paths in order to begin :</p>
          <p className={`text-sm opacity-80 mt-3`}>
            By selecting a client folder, the other fields are populated automatically. If you want to select folders
            manually, you can skip the client selection and switch the desired fields to manual mode to browse each
            folder individually.
          </p>
          <div className={`mt-7`}></div>
          <Item label={`Stable Diffusion Client`}>
            <FileInput placeholder={`SD Client Folder Path...`} value={clientPath} onValue={setClientPath} />
            <span className={`absolute text-xs left-0 -bottom-6 opacity-60`}>Only Automatic1111 is supported</span>
          </Item>
          <div className={`mt-16`}></div>
          {Object.values(paths).map((item) => (
            <Item
              className={`mt-4`}
              labelClassName={`w-32`}
              key={item.label}
              label={item.label}
              startEl={
                <MiniSwitch
                  className={`w-10`}
                  value={item.isAuto}
                  trueText={`A`}
                  falseText={`M`}
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
          <div className={`w-full flex items-center justify-end`}>
            <Button className={`mt-12 h-10 w-32 bg-gray-800 hover:bg-gray-900 justify-center`} onClick={save}>
              SAVE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
