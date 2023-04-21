import { useLocation } from 'wouter';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { Icon } from '@/components/Icon/Icon';
import { Button, ButtonClickEvent } from '@/components/Button/Button';
import { UserPathsForm, UserPathsFormElement } from '@/features/UserPathsForm/UserPathsForm';
import { SettingsState } from '@/states/Settings';
import { Modal } from '@/components/Modal/Modal';
import { checkDirPermission, checkFilePermission, fileExists } from '@/helpers/node.helper';
import { checkStorage } from '@/services/storage';
import { API } from '@/api';

export const Startup = () => {
  const [location, navigate] = useLocation();
  const userPathsFormRef = useRef<UserPathsFormElement>(null);
  const [atomUserPaths, setAtomUserPaths] = useAtom(SettingsState.userPaths);
  const [openPathsPermissionErrorModal, setOpenPathsPermissionErrorModal] = useState<string | undefined>(undefined);
  const [openStoragePermissionErrorModal, setOpenStoragePermissionErrorModal] = useState(false);

  const navigateToBrowser = useCallback(() => {
    navigate('/browser');
  }, [navigate]);

  const save = useCallback(
    async (e: ButtonClickEvent) => {
      e.setLoading(true);
      const formValues = userPathsFormRef.current?.export();

      if (!formValues) {
        e.setLoading(false);

        return;
      }

      try {
        await checkStorage();
      } catch {
        e.setLoading(false);
        setOpenStoragePermissionErrorModal(true);

        return;
      }

      for (const i of Object.values(formValues)) {
        if (i && typeof i === 'string' && i !== '') {
          const exists = await fileExists(i);

          if (!exists) continue;

          const result = await checkDirPermission(i, 'readwrite');

          if (!result) {
            setOpenPathsPermissionErrorModal(i);
            e.setLoading(false);

            return;
          }
        }
      }

      setAtomUserPaths(formValues);
      navigateToBrowser();
    },
    [navigateToBrowser, setAtomUserPaths],
  );

  useEffect(() => {
    if (Object.values(atomUserPaths).some((x) => !!x && x !== '')) {
      navigateToBrowser();
    }
  }, []);

  return (
    <>
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
            <p className={`text-lg mb-3`}>Please specify the needed folder paths in order to begin :</p>
            <UserPathsForm ref={userPathsFormRef} />
            <div className={`w-full flex items-center justify-end`}>
              <Button className={`mt-12 h-10 w-32 bg-gray-800 hover:bg-gray-900 justify-center`} onClick={save}>
                SAVE
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        withCloseButton
        width={`28rem`}
        height={`auto`}
        title={`Permission Error`}
        open={!!openPathsPermissionErrorModal}
        onClose={() => {
          setOpenPathsPermissionErrorModal(undefined);
        }}
      >
        <p className={`mt-3`}>
          ModelWay needs <strong>Read</strong> and <strong>Write</strong> access for the following folder. Please update
          the permissions and try again.
        </p>
        <p className={`mt-3 opacity-90`}>{openPathsPermissionErrorModal}</p>
        <Button
          className={`w-32 mx-auto mt-8`}
          onClick={() => {
            setOpenPathsPermissionErrorModal(undefined);
          }}
        >
          OKAY
        </Button>
      </Modal>
      <Modal
        withCloseButton
        width={`28rem`}
        height={`auto`}
        title={`Storage Permission Error`}
        open={openStoragePermissionErrorModal}
        onClose={() => {
          setOpenStoragePermissionErrorModal(false);
        }}
      >
        <p className={`mt-3`}>
          ModelWay cannot access its storage folder for saving models info. Make sure <strong>Read</strong> and{' '}
          <strong>Write</strong> permissions are given to the following folder:
        </p>
        <p className={`mt-3 opacity-90`}>{API.userDataPath}</p>
        <Button
          className={`w-32 mx-auto mt-8`}
          onClick={() => {
            setOpenStoragePermissionErrorModal(false);
          }}
        >
          OKAY
        </Button>
      </Modal>
    </>
  );
};
