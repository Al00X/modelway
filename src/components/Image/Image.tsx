import { ModelImage } from '@/interfaces/models.interface';
import './Image.scss';
import { ResolveImage } from '@/services/image-asset';
import { useAtom } from 'jotai';
import { SettingsState } from '@/states/Settings';
import { useState } from 'react';
import {Blurhash} from "react-blurhash";

export default function Image(props: { item: ModelImage; fit?: 'width' | 'height'; onClick?: () => void, onLoad?: () => void; }) {
  const [isNSFW, setNSFW] = useAtom(SettingsState.isNSFWToggled);
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      onClick={props.onClick}
      className={`model-image ${props.fit === 'width' ? 'fit-width' : props.fit === 'height' ? 'fit-height' : ''} ${
        props.onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className={`transition-all absolute inset-0 pointer-events-none`}></div>
      {!loaded && <div style={{aspectRatio: props.item.width && props.item.height ? props.item.width / props.item.height : 'initial'}} className={`h-full w-auto bg-gray-800`}>
        {props.item.hash && <Blurhash className={`w-full h-full`} hash={props.item.hash}/>}
      </div>}
      <img
        className={`transition-all ${!isNSFW && props.item.nsfw ? 'blurry' : ''} ${loaded ? '' : 'invisible absolute'}`}
        src={ResolveImage(props.item)}
        width={props.item.width ?? undefined}
        height={props.item.height ?? undefined}
        alt=""
        onLoad={() => {
          props.onLoad?.();
          setLoaded(true);
        }}
        loading="lazy"
      />
    </div>
  );
}
