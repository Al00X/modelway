import Modal from "@/components/Modal/Modal";
import {ModelImage} from "@/interfaces/models.interface";
import Image from '@/components/Image/Image';
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import {useEffect, useState} from "react";
import Section from "@/components/Section/Section";
import './ImageDetailsDialog.scss';

export default function ImageDetailsDialog(props: {open: number;
  onClose: () => void; images: ModelImage[]}) {
  const [currentImage, setCurrentImage] = useState<ModelImage | null>(null);

  useEffect(() => {
      setCurrentImage(props.images[props.open])
  }, [props.open])
  return <Modal withCloseButton={true} width={`90vw`} height={`90vh`} open={props.open >= 0} onClose={props.onClose}>
    <div className={`w-full h-full flex gap-8`}>
      <div className={`flex-auto h-full`}>
        {currentImage && <TransformWrapper centerOnInit={false} initialScale={1}>
          <TransformComponent wrapperClass={`w-full h-full`}>
            <Image item={currentImage!} legalize={true} cursor={`default`}/>
          </TransformComponent>
        </TransformWrapper>}
      </div>
      <div className={`flex-none w-[25rem] overflow-auto flex flex-col gap-4 p-2 pb-20`}>
        <Section wrapperClass={`w-full`} label={`Prompt`}>
          <p className={`select-text leading-7`}>{currentImage?.meta?.prompt ?? 'N/A'}</p>
        </Section>
        <Section wrapperClass={`w-full`} label={`Negative`}>
          <p className={`select-text leading-7`}>{currentImage?.meta?.negativePrompt ?? 'N/A'}</p>
        </Section>
        <div className={`info-grid mt-7`}>
          {currentImage?.meta?.sampler && <p className={`col-span-2`}>Sampler: <span>{currentImage?.meta?.sampler}</span></p>}
          {currentImage?.meta?.steps && <p>Steps: <span>{currentImage?.meta?.steps}</span></p>}
          {currentImage?.meta?.cfgScale && <p>CFG: <span>{currentImage?.meta?.cfgScale}</span></p>}

        </div>
        <div className={`info-grid opacity-60 mt-auto pt-2`}>
          {currentImage?.meta?.hash && <p>Hash: <span>{currentImage?.meta?.hash}</span></p>}
          {currentImage?.meta?.seed && <p>Seed: <span>{currentImage?.meta?.seed}</span></p>}
        </div>
      </div>
    </div>
  </Modal>
}
