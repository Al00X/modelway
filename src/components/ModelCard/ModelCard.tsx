import './ModelCard.scss';
import { useEffect, useState } from 'react';
import { useHover } from '@mantine/hooks';
import { Image } from '@/components/Image/Image';
import { ModelExtended, ModelImage } from '@/interfaces/models.interface';
import { Item } from '@/components/Item/Item';
import { Icon } from '@/components/Icon/Icon';
import { clipboardSet } from '@/services/clipboard';

interface ModelCardKeyImages {
  single: ModelImage | null;
  double: ModelImage[];
  triple: ModelImage[];
}

export const ModelCard = (props: { item: ModelExtended; wide?: boolean; onClick?: (item: ModelExtended) => void }) => {
  const [keyImages, setKeyImages] = useState<ModelCardKeyImages>({ single: null, double: [], triple: [] });
  const hoverState = useHover();

  useEffect(() => {
    const imagesArray: ModelImage[] = [];

    for (const i of [
      props.item.metadata.coverImage,
      ...(props.item.metadata.currentVersion.images?.slice(0, 3) ?? []),
      props.item.thumbnailPath ? { url: props.item.thumbnailPath } : undefined,
    ]) {
      if (!i || imagesArray.findIndex((x) => x.url === i.url) !== -1) continue;
      imagesArray.push(i as ModelImage);
    }

    setKeyImages({
      single: imagesArray.length > 0 ? imagesArray[0] : null,
      double: imagesArray.length > 1 ? [imagesArray[0], imagesArray[1]] : imagesArray,
      triple: imagesArray.slice(0, 3),
    });
  }, [props.item, props.item.metadata.coverImage]);

  return (
    <div
      ref={hoverState.ref}
      role={`presentation`}
      className={`model-card ${props.wide ? 'wide' : ''}`}
      onClick={() => props.onClick?.(props.item)}
    >
      {!props.wide ? (
        <>
          {!!keyImages.single && <Image item={keyImages.single} />}
          <div className={`flex flex-col text-overlay font-bold tracking-wide`}>
            <div className={`text-base  w-full flex flex-col items-center justify-center py-1 px-1`}>
              <span className={``}>{props.item.computed.name}</span>
              {!!props.item.computed.version && (
                <span
                  className={`w-fit text-xs font-bold tracking-wider px-3 bg-black bg-opacity-70 rounded-xl text-white py-1 mt-1`}
                >
                  {props.item.computed.version}
                </span>
              )}
            </div>
            <div className={`h-6`}>{/* Space Bro */}</div>
            <div
              className={`absolute left-0 right-0 bottom-0 transition-all flex items-center bg-gray-400 bg-opacity-20 backdrop-blur-sm w-full overflow-hidden px-3 ${
                hoverState.hovered ? 'h-6' : 'h-0'
              }`}
            >
              <Item
                className={`gap-0`}
                onClick={(e) => {
                  e.stopPropagation();
                  clipboardSet(props.item.metadata.currentVersion.triggers?.join(', '));
                }}
              >
                <Icon size={`0.75rem`} icon={`copy`} />
                <span className={`text-2xs`}>COPY TRIGGERS</span>
              </Item>
            </div>
          </div>
          {!!props.item.metadata.currentVersion.baseModel && (
            <div
              className={`absolute left-0 top-0 py-1 px-2 bg-gray-900 text-white text-sm shadow-sm font-medium rounded-br-xl`}
            >
              {props.item.metadata.currentVersion.baseModel}
            </div>
          )}
          {!!props.item.metadata.nsfw && (
            <div
              className={`absolute text-xs tracking-widest font-medium shadow-sm top-0 right-0 py-1.5 px-2 pl-3 bg-red-600 rounded-bl-xl bg-opacity-60 backdrop-blur-sm`}
            >
              NSFW
            </div>
          )}
        </>
      ) : (
        <div className={`flex w-full h-full`}>
          <div className={`flex flex-col`}>
            <p className={`text-2xl flex items-center font-medium`}>
              {props.item.computed.name}{' '}
              {!!props.item.metadata.nsfw && (
                <span className={`ml-4 bg-red-600 px-3 py-1 text-xs font-medium rounded-full`}>NSFW</span>
              )}
            </p>
            {!!props.item.metadata.currentVersion.baseModel && (
              <p className={`opacity-60 mt-2`}>Base: {props.item.metadata.currentVersion.baseModel}</p>
            )}
          </div>
          <div className={`flex gap-1 ml-auto max-w-[65%]`}>
            {keyImages.triple.map((i) => (
              <Image key={i.url} item={i} fit={`height`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
