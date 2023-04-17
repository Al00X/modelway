import { useLocation } from 'wouter';
import { useCallback, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { Icon } from '@/components/Icon/Icon';
import { Button } from '@/components/Button/Button';
import { UserPathsForm, UserPathsFormElement } from '@/features/UserPathsForm/UserPathsForm';
import { SettingsState } from '@/states/Settings';

export const Startup = () => {
  const [location, navigate] = useLocation();
  const userPathsFormRef = useRef<UserPathsFormElement>(null);
  const [atomUserPaths, setAtomUserPaths] = useAtom(SettingsState.userPaths);

  const navigateToBrowser = useCallback(() => {
    navigate('/browser');
  }, [navigate]);

  const save = useCallback(() => {
    const formValues = userPathsFormRef.current?.export();

    if (!formValues) return;

    setAtomUserPaths(formValues);
    navigateToBrowser();
  }, [navigateToBrowser, setAtomUserPaths]);

  useEffect(() => {
    if (Object.values(atomUserPaths).some((x) => !!x && x !== '')) {
      navigateToBrowser();
    }
  }, []);

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
  );
};
