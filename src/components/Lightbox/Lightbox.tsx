import Lightbox18 from 'react-18-image-lightbox';
import { ModelImage } from '@/interfaces/models.interface';
import { resolveImage } from '@/services/image-asset';

export const Lightbox = ({
  index = -1,
  ...props
}: {
  index?: number;
  images: ModelImage[];
  onChange?: (e: number) => void;
}) => {
  return (
    <div>
      {index !== -1 && (
        <Lightbox18
          mainSrc={resolveImage(props.images[index])}
          nextSrc={resolveImage(props.images[(index + 1) % props.images.length])}
          prevSrc={resolveImage(props.images[(index + props.images.length - 1) % props.images.length])}
          onCloseRequest={() => {
            props.onChange?.(-1);
          }}
          onMovePrevRequest={() => {
            props.onChange?.((index + props.images.length - 1) % props.images.length);
          }}
          onMoveNextRequest={() => {
            props.onChange?.((index + 1) % props.images.length);
          }}
        />
      )}
    </div>
  );
};
