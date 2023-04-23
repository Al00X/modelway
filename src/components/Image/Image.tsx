import './Image.scss';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { Blurhash } from 'react-blurhash';
import { SettingsState } from '@/states/Settings';
import useContextMenu from '@/hooks/useContextMenu';
import { ModelImage } from '@/interfaces/models.interface';
import { Img } from '@/components/Image/Img';
import { Loader } from '@/components/Loader/Loader';

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
        <div
          style={{ aspectRatio }}
          className={`${
            props.item.height > props.item.width ? 'w-full h-auto' : 'h-full w-auto'
          } bg-gray-800 flex items-center justify-center`}
        >
          {!!props.item.hash && <Blurhash className={`w-full h-full`} hash={props.item.hash} />}
          <Loader className={`absolute`} />
        </div>
      )}
      <Img
        src={props.item.url}
        metadata={props.item.meta}
        draggable={false}
        width={props.item.width}
        height={props.item.height}
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
