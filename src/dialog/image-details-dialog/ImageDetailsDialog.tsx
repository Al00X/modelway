import { ReactZoomPanPinchContentRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { useEffect, useReducer, useRef } from 'react';
import { Modal } from '@/components/Modal/Modal';
import { ModelImage } from '@/interfaces/models.interface';
import { Image, ImageElement } from '@/components/Image/Image';
import { Section } from '@/components/Section/Section';
import './ImageDetailsDialog.scss';
import { Button } from '@/components/Button/Button';

export const ImageDetailsDialog = (props: {
  open: number;
  onClose: () => void;
  images: ModelImage[];
  onFullResRequest: () => void;
}) => {
  const [currentImage, updateCurrentImage] = useReducer(() => {
    return props.images.length > props.open ? props.images[props.open] : null;
  }, null);
  const pannerRef = useRef<ReactZoomPanPinchContentRef>(null);
  const imageRef = useRef<ImageElement>(null);

  useEffect(() => {
    updateCurrentImage();
    setTimeout(() => {
      pannerRef.current?.centerView();
    }, 50);
  }, [props.open, currentImage, props.images]);

  return (
    <Modal withCloseButton width={`90vw`} height={`90vh`} open={props.open >= 0} onClose={props.onClose}>
      <div className={`w-full h-full flex gap-8`}>
        <div className={`flex flex-col flex-auto`}>
          <div className={`flex-auto h-full bg-gray-800 rounded-xl p-2`}>
            {!!currentImage && (
              <TransformWrapper ref={pannerRef} initialScale={1}>
                <TransformComponent
                  wrapperClass={`w-full h-full`}
                  contentClass={`${currentImage.width > currentImage.height ? 'w-full' : 'h-full'}`}
                >
                  <Image legalize item={currentImage} cursor={`default`} />
                </TransformComponent>
              </TransformWrapper>
            )}
          </div>
          <Button disabled title={`WIP`} className={`left-3 top-3 w-64 mb-3 `} onClick={props.onFullResRequest}>
            Load Image Full Resolution
          </Button>
        </div>
        <div className={`flex-none w-[25rem] overflow-auto flex flex-col gap-4 p-2 pb-20`}>
          <Section wrapperClass={`w-full`} label={`Prompt`}>
            <p className={`select-text leading-7`}>{currentImage?.meta?.prompt ?? 'N/A'}</p>
          </Section>
          <Section wrapperClass={`w-full`} label={`Negative`}>
            <p className={`select-text leading-7`}>{currentImage?.meta?.negativePrompt ?? 'N/A'}</p>
          </Section>
          <div className={`info-grid mt-7`}>
            {!!currentImage?.meta?.sampler && (
              <p className={`col-span-2`}>
                Sampler: <span>{currentImage.meta.sampler}</span>
              </p>
            )}
            {!!currentImage?.meta?.steps && (
              <p>
                Steps: <span>{currentImage.meta.steps}</span>
              </p>
            )}
            {!!currentImage?.meta?.cfgScale && (
              <p>
                CFG: <span>{currentImage.meta.cfgScale}</span>
              </p>
            )}
          </div>
          <div className={`info-grid opacity-60 mt-auto pt-2`}>
            {!!currentImage?.meta?.hash && (
              <p>
                Hash: <span>{currentImage.meta.hash}</span>
              </p>
            )}
            {!!currentImage?.meta?.seed && (
              <p>
                Seed: <span>{currentImage.meta.seed}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
