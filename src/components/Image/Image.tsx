import './Image.scss';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { Blurhash } from 'react-blurhash';
import { resolveImage } from '@/services/image-asset';
import { SettingsState } from '@/states/Settings';
import useContextMenu from '@/hooks/useContextMenu';
import { ModelImage } from '@/interfaces/models.interface';

export const Image = (props: {
  item: ModelImage;
  fit?: 'width' | 'height';
  onClick?: (e: MouseEvent) => void;
  onLoad?: () => void;
  onUpdate?: (item: ModelImage) => void;
  onSetAsCover?: () => void;
  cursor?: 'auto' | 'pointer' | 'default';
  legalize?: boolean;
}) => {
  const [isNSFW, setNSFW] = useAtom(SettingsState.isNSFWToggled);
  const [loaded, setLoaded] = useState(false);
  const [contextRef] = useContextMenu({
    items: [
      {
        key: 'nsfw',
        text: () => `${props.item.nsfw ? 'Remove NSFW' : 'Set as NSFW'}`,
        action: () => {
          props.item.nsfw = !props.item.nsfw;
          props.onUpdate?.(props.item);
        },
      },
      {
        key: 'cover',
        text: 'Set as cover photo',
        action: () => {
          props.onSetAsCover?.();
        },
      },
      {
        key: 'remove',
        text: 'Remove from gallery',
        action: () => {
          props.item.hide = true;
          props.onUpdate?.(props.item);
        },
      },
    ],
  });
  const [aspectRatio, setAspectRatio] = useState<number | string>(
    props.item.width && props.item.height ? props.item.width / props.item.height : 'initial',
  );

  return (
    <div
      role={`presentation`}
      ref={contextRef}
      style={{ aspectRatio }}
      className={`model-image ${props.fit === 'width' ? 'fit-width' : props.fit === 'height' ? 'fit-height' : ''} ${
        props.cursor === 'auto' || props.cursor === undefined
          ? props.onClick
            ? 'cursor-pointer'
            : ''
          : props.cursor === 'pointer'
          ? 'cursor-pointer'
          : ''
      }`}
      onClick={(e) => props.onClick?.(e as never)}
    >
      <div className={`transition-all absolute inset-0 pointer-events-none`}></div>
      {!loaded && (
        <div style={{ aspectRatio }} className={`h-full w-auto bg-gray-800`}>
          {!!props.item.hash && <Blurhash className={`w-full h-full`} hash={props.item.hash} />}
        </div>
      )}
      <img
        draggable={false}
        src={resolveImage(props.item)}
        width={props.item.width ?? undefined}
        height={props.item.height ?? undefined}
        alt=""
        loading="eager"
        className={`transition-all ${!isNSFW && props.item.nsfw && !props.legalize ? 'blurry' : ''} ${
          loaded ? '' : 'invisible absolute'
        }`}
        onLoad={() => {
          props.onLoad?.();
          setLoaded(true);
        }}
      />
    </div>
  );
};
