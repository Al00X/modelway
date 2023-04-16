import './TitleBar.scss';
import { MouseEvent, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { Icon } from '@/components/Icon/Icon';
import { API } from '@/api';
import { SettingsState } from '@/states/Settings';
import { MiniSwitch } from '@/components/MiniSwitch/MiniSwitch';

export const TitleBar = () => {
  const [maximized, setMaximized] = useState(false);
  const [isNSFW, setNSFW] = useAtom(SettingsState.isNSFWToggled);

  function doAction(e: MouseEvent<HTMLButtonElement>, action: 'minimize' | 'close' | 'maximize' | 'settings') {
    e.stopPropagation();
    if (action === 'settings') {
      // TODO: Settings
      return;
    }
    API().WindowAction(action);
    if (action === 'maximize') {
      setMaximized(!maximized);
    }
  }

  useEffect(() => {
    API()
      .IsWindowMaximized()
      .then((state) => {
        setMaximized(!!state);
      })
      .catch(() => {
        console.error('Window Get State Failed (Electron API)');
      });
  }, []);

  return (
    <div className={`title-bar-panel`} style={{ zIndex: 99999 }}>
      <div className={`draggable`}>
        <p className={`ml-4 text-sm`}>ModelWay</p>
      </div>
      <MiniSwitch value={isNSFW} trueText={`NSFW`} falseText={`SFW`} onValue={setNSFW} />
      <div className={`w-4`}>{/* Space */}</div>
      {/*<button className={`control-btn font-bold ${isNSFW ? 'bg-white text-black hover:bg-opacity-80' : 'bg-white bg-opacity-0 hover:bg-opacity-10 text-white'}`} style={{fontSize: '10px', letterSpacing: '1.25px'}} onClick={() => setNSFW(!isNSFW)} tabIndex={-1}>{isNSFW ? 'NSFW' : 'SFW'}</button>*/}
      <button
        className={`control-btn`}
        tabIndex={-1}
        onClick={(e) => {
          doAction(e, 'settings');
        }}
      >
        <Icon icon={`settings`} />
      </button>
      <button
        className={`control-btn`}
        tabIndex={-1}
        onClick={(e) => {
          doAction(e, 'minimize');
        }}
      >
        <Icon icon={`minimize`} />
      </button>
      <button
        className={`control-btn`}
        tabIndex={-1}
        onClick={(e) => {
          doAction(e, 'maximize');
        }}
      >
        <Icon icon={maximized ? `unmaximize` : `maximize`} />
      </button>
      <button
        className={`control-btn`}
        tabIndex={-1}
        onClick={(e) => {
          doAction(e, 'close');
        }}
      >
        <Icon icon={`close`} />
      </button>
    </div>
  );
};
