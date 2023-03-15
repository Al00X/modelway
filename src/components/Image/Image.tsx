import { ModelImage } from '@/interfaces/models.interface';
import './Image.scss';
import { ResolveImage } from '@/services/image-asset';
import { useAtom } from 'jotai';
import { SettingsState } from '@/states/Settings';
import { useState } from 'react';
import { Blurhash } from 'react-blurhash';
import useContextMenu from '@/hooks/useContextMenu';

export default function Image(props: {
  item: ModelImage;
  fit?: 'width' | 'height';
  onClick?: () => void;
  onLoad?: () => void;
  onUpdate?: (item: ModelImage) => void;
  onSetAsCover?: () => void;
}) {
  const [isNSFW, setNSFW] = useAtom(SettingsState.isNSFWToggled);
  const [loaded, setLoaded] = useState(false);
  const [contextRef] = useContextMenu({
    items: [
      {
        text: () => `${props.item.nsfw ? 'Remove NSFW' : 'Set as NSFW'}`,
        action: () => {
          props.item.nsfw = !props.item.nsfw;
          // props.onUpdate?.(props.item);
        },
      },
      { text: 'Set as cover photo', action: () => {
        props.onSetAsCover?.();
        } },
      {
        text: 'Remove from gallery',
        action: () => {
          props.item.hide = true;
          // props.onUpdate?.(props.item);
        },
      },
    ],
  });
  const [aspectRatio, setAspectRatio] = useState<number | string>(
    props.item.width && props.item.height ? props.item.width / props.item.height : 'initial',
  );

  return (
    <>
      <div
        ref={contextRef}
        onClick={props.onClick}
        className={`model-image ${props.fit === 'width' ? 'fit-width' : props.fit === 'height' ? 'fit-height' : ''} ${
          props.onClick ? 'cursor-pointer' : ''
        }`}
        style={{ aspectRatio: aspectRatio }}
      >
        <div className={`transition-all absolute inset-0 pointer-events-none`}></div>
        {!loaded && (
          <div style={{ aspectRatio: aspectRatio }} className={`h-full w-auto bg-gray-800`}>
            {props.item.hash && <Blurhash className={`w-full h-full`} hash={props.item.hash} />}
          </div>
        )}
        <img
          className={`transition-all ${!isNSFW && props.item.nsfw ? 'blurry' : ''} ${
            loaded ? '' : 'invisible absolute'
          }`}
          src={ResolveImage(props.item)}
          width={props.item.width ?? undefined}
          height={props.item.height ?? undefined}
          alt=""
          onLoad={() => {
            props.onLoad?.();
            setLoaded(true);
          }}
          loading="eager"
        />
      </div>
    </>
  );
}
