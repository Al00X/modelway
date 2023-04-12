import './TitleBar.scss';
import {MouseEvent} from "react";
import Icon from "@/components/Icon/Icon";
import {API} from "@/api";
import {useEffect, useState} from "react";
import {useAtom} from "jotai";
import {SettingsState} from "@/states/Settings";

export default function TitleBar() {
  const [isMaximized, setMaximized] = useState(false);
  const [isNSFW, setNSFW] = useAtom(SettingsState.isNSFWToggled);

  function doAction(e: MouseEvent<HTMLButtonElement>, action: "minimize" | "close" | "maximize" | "settings") {
    e.stopPropagation();
    if (action === 'settings') {
      // TODO: Settingsss
      return;
    }
    API().WindowAction(action);
    if (action === 'maximize') {
      setMaximized(!isMaximized);
    }
  }

  useEffect(() => {
    API().IsWindowMaximized().then(state => {
      setMaximized(!!state);
    })
  }, []);

  return <div className={`title-bar-panel`} style={{zIndex: 99999}}>
    <div className={`draggable`}>
      <p className={`ml-4 text-sm`}>ModelWay</p>
    </div>
    <MiniSwitch value={isNSFW} onValue={setNSFW} trueText={`NSFW`} falseText={`SFW`}/>
    <div className={`w-4`}>{/* Space */}</div>
    {/*<button className={`control-btn font-bold ${isNSFW ? 'bg-white text-black hover:bg-opacity-80' : 'bg-white bg-opacity-0 hover:bg-opacity-10 text-white'}`} style={{fontSize: '10px', letterSpacing: '1.25px'}} onClick={() => setNSFW(!isNSFW)} tabIndex={-1}>{isNSFW ? 'NSFW' : 'SFW'}</button>*/}
    <button className={`control-btn`} onClick={(e) => doAction(e, 'settings')} tabIndex={-1}><Icon icon={`settings`} /></button>
    <button className={`control-btn`} onClick={(e) => doAction(e, 'minimize')} tabIndex={-1}><Icon icon={`minimize`} /></button>
    <button className={`control-btn`} onClick={(e) => doAction(e, 'maximize')} tabIndex={-1}><Icon icon={isMaximized ? `unmaximize` : `maximize`} /></button>
    <button className={`control-btn`} onClick={(e) => doAction(e, 'close')} tabIndex={-1}><Icon icon={`close`} /></button>
  </div>
}

function MiniSwitch(props: {
  value: boolean;
  onValue: (e: boolean) => void;
  falseText: string;
  trueText: string;
}) {
  return <div onClick={() => props.onValue(!props.value)} style={{width: '52px', height: '28px'}} className={`transition-all relative p-0.5 border-white cursor-pointer`}>
    <div style={{fontSize: '10px', letterSpacing: '1.45px'}} className={`transition-all w-full h-full flex items-center justify-center font-bold border ${props.value ? 'bg-white text-black hover:bg-opacity-80 border-transparent' : 'bg-white bg-opacity-0 hover:bg-opacity-10 text-white border-white'}`}>{props.value ? props.trueText : props.falseText}</div>
  </div>
}
