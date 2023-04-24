import './TitleBar.scss';
import { MouseEvent, useEffect, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { version } from '../../../package.json';
import { Icon } from '@/components/Icon/Icon';
import { API } from '@/api';
import { SettingsState } from '@/states/Settings';
import { MiniSwitch } from '@/components/MiniSwitch/MiniSwitch';
import { SettingsDialog } from '@/dialog/settings-dialog/SettingsDialog';
import { ChangelogDialog } from '@/dialog/changelog-dialog/ChangelogDialog';
import { AppState } from '@/states/App';

export const TitleBar = () => {
  const [maximized, setMaximized] = useState(false);
  const [isNSFW, setNSFW] = useAtom(SettingsState.isNSFWToggled);
  const [openSettings, setOpenSettings] = useState(false);
  const [openChangelog, setOpenChangelog] = useState(false);
  const isAppLoading = useAtomValue(AppState.isLoading);

  function doAction(
    action: 'minimize' | 'close' | 'maximize' | 'settings' | 'nsfw' | 'changelog',
    e?: MouseEvent<HTMLButtonElement>,
    payload?: any,
  ) {
    e?.stopPropagation();
    switch (action) {
      case 'changelog': {
        if (isAppLoading) return;
        setOpenChangelog(true);
        break;
      }
      case 'settings': {
        if (isAppLoading) return;
        setOpenSettings(true);
        break;
      }
      case 'nsfw': {
        if (isAppLoading) return;
        setNSFW(payload);
        break;
      }
      default: {
        API.doWindowAction(action);
        if (action === 'maximize') {
          setMaximized(!maximized);
        }
        break;
      }
    }
  }

  useEffect(() => {
    API.isWindowMaximized()
      .then((state) => {
        setMaximized(!!state);
      })
      .catch((e) => {
        console.error('Window Get State Failed (Electron API)', e);
      });
  }, []);

  return (
    <div className={`title-bar-panel`} style={{ zIndex: 99999 }}>
      <div className={`draggable`}>
        <div style={{ letterSpacing: '3.5px' }} className={`ml-4 text-sm relative font-medium`}>
          MODELWAY
          {/*<Icon className={`absolute -right-3 top-0`} icon={'y'} size={'1.125rem'} />*/}
        </div>
        <span
          tabIndex={-1}
          role={`button`}
          className={`transition-all absolute cursor-pointer text-xs opacity-40 hover:opacity-70 font-normal left-[8rem] mt-0 z-10 no-drag`}
          style={{ letterSpacing: '1.5px' }}
          onClick={(e) => {
            doAction('changelog', e as any);
          }}
        >
          V{version}
        </span>
      </div>
      <MiniSwitch
        value={isNSFW}
        trueText={`NSFW`}
        falseText={`SFW`}
        onValue={(e) => {
          doAction('nsfw', undefined, e);
        }}
      />
      <div className={`w-4`}>{/* Space */}</div>
      {/*<button className={`control-btn font-bold ${isNSFW ? 'bg-white text-black hover:bg-opacity-80' : 'bg-white bg-opacity-0 hover:bg-opacity-10 text-white'}`} style={{fontSize: '10px', letterSpacing: '1.25px'}} onClick={() => setNSFW(!isNSFW)} tabIndex={-1}>{isNSFW ? 'NSFW' : 'SFW'}</button>*/}
      <button
        className={`control-btn`}
        tabIndex={-1}
        onClick={(e) => {
          doAction('settings', e);
        }}
      >
        <Icon icon={`settings`} />
      </button>
      <button
        className={`control-btn`}
        tabIndex={-1}
        onClick={(e) => {
          doAction('minimize', e);
        }}
      >
        <Icon icon={`minimize`} />
      </button>
      <button
        className={`control-btn`}
        tabIndex={-1}
        onClick={(e) => {
          doAction('maximize', e);
        }}
      >
        <Icon icon={maximized ? `unmaximize` : `maximize`} />
      </button>
      <button
        className={`control-btn`}
        tabIndex={-1}
        onClick={(e) => {
          doAction('close', e);
        }}
      >
        <Icon icon={`close`} />
      </button>
      <SettingsDialog
        open={openSettings}
        onClose={() => {
          setOpenSettings(false);
        }}
      />
      <ChangelogDialog
        open={openChangelog}
        onClose={() => {
          setOpenChangelog(false);
        }}
      />
    </div>
  );
};
