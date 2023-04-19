import { useCallback, useRef } from 'react';
import { useAtom } from 'jotai';
import { Modal } from '@/components/Modal/Modal';
import { UserPathsForm, UserPathsFormElement } from '@/features/UserPathsForm/UserPathsForm';
import { Button } from '@/components/Button/Button';
import { SettingsState } from '@/states/Settings';

export const SettingsDialog = (props: { open: boolean; onClose: () => void }) => {
  const [atomUserPaths, setAtomUserPaths] = useAtom(SettingsState.userPaths);
  const userPathsFormRef = useRef<UserPathsFormElement>(null);

  const save = useCallback(() => {
    const formValues = userPathsFormRef.current?.export();

    if (!formValues) return;

    setAtomUserPaths(formValues);
    props.onClose();
  }, [setAtomUserPaths, props.onClose]);

  return (
    <Modal
      withCloseButton
      title={`Settings`}
      open={props.open}
      className={`z-[6666]`}
      width={`45rem`}
      height={`auto`}
      onClose={props.onClose}
    >
      <UserPathsForm className={`mt-5`} ref={userPathsFormRef} />
      <div className={`w-full flex items-center justify-end`}>
        <Button className={`mt-12 h-10 w-32 bg-gray-800 hover:bg-gray-900 justify-center`} onClick={save}>
          SAVE
        </Button>
      </div>
    </Modal>
  );
};
