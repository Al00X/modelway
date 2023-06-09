import { useEffect, useRef, useState } from 'react';
import { imageFetch } from '@/services/image-asset';
import { saveAssetBlob } from '@/services/storage';
import { ModelImage } from '@/interfaces/models.interface';

export const Img = (props: {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
  loading?: 'eager' | 'lazy';
  draggable?: boolean;
  className?: string;
  metadata?: ModelImage['meta'];
  onLoad?: () => void;
}) => {
  const isFetching = useRef(false);
  const [src, setSrc] = useState<string | undefined>();

  useEffect(() => {
    const fetchImage = async () => {
      if (isFetching.current) return;
      isFetching.current = true;

      const result = await imageFetch(props.src);

      if (result.blob && result.filename) {
        setSrc(URL.createObjectURL(result.blob));
        await saveAssetBlob(result.filename, result.blob);
      } else {
        setSrc(result.src);
      }

      // eslint-disable-next-line require-atomic-updates
      isFetching.current = false;
    };

    fetchImage().catch((err) => {
      console.error('Image fetch failed', err);
    });
  }, [props.src]);

  return (
    <img
      draggable={props.draggable}
      src={src}
      width={props.width}
      height={props.height}
      alt={props.alt ?? ''}
      loading={props.loading ?? 'eager'}
      className={props.className}
      onLoad={props.onLoad}
    />
  );
};
