import './ModelCard.scss';
import { useEffect, useState } from 'react';
import { Image } from '@/components/Image/Image';
import { ModelExtended, ModelImage } from '@/interfaces/models.interface';

interface ModelCardKeyImages {
  single: ModelImage | null;
  double: ModelImage[];
  triple: ModelImage[];
}

export const ModelCard = (props: { item: ModelExtended; wide?: boolean; onClick?: (item: ModelExtended) => void }) => {
  const [keyImages, setKeyImages] = useState<ModelCardKeyImages>({ single: null, double: [], triple: [] });

  useEffect(() => {
    const imagesArray: ModelImage[] = [];

    for (const i of [
      props.item.metadata.coverImage,
      ...(props.item.metadata.currentVersion.images?.slice(0, 3) ?? []),
    ]) {
      if (!i || imagesArray.findIndex((x) => x.url === i.url) !== -1) continue;
      imagesArray.push(i);
    }

    setKeyImages({
      single: imagesArray.length > 0 ? imagesArray[0] : null,
      double: imagesArray.length > 1 ? [imagesArray[0], imagesArray[1]] : imagesArray,
      triple: imagesArray,
    });
  }, [props.item, props.item.metadata.coverImage]);

  return (
    <div
      role={`presentation`}
      className={`model-card ${props.wide ? 'wide' : ''}`}
      onClick={() => props.onClick?.(props.item)}
    >
      {!props.wide ? (
        <>
          {!!keyImages.single && <Image item={keyImages.single} />}
          <div className={`flex flex-col text-overlay font-semibold tracking-wide`}>
            {props.item.computed.name}
            {!!props.item.computed.version && (
              <span
                className={`text-sm font-bold tracking-wider px-2 text-white py-1 bg-black bg-opacity-80 rounded-xl mt-1`}
              >
                {props.item.computed.version}
              </span>
            )}
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
