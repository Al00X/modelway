import { useEffect, useState } from 'react';
import { Model } from '@/interfaces/models.interface';
import { ModelCardComputed } from '@/components/ModelCard/ModelCard';
import TagList from '@/components/TagList/TagList';
import Image from '@/components/Image/Image';
import Button from '@/components/Button/Button';
import Lightbox from '@/components/Lightbox/Lightbox';
import Modal from '@/components/Modal/Modal';
import { useKeenSlider } from 'keen-slider/react';
import { Clone } from '@/helpers/object.helper';
import {useForceUpdate} from "@mantine/hooks";

const Separator = `    .    `;

type ModelDialogItem = Model & { computed: ModelCardComputed };

export default function ModelDetailsDialog(props: {
  open: boolean;
  onClose: () => void;
  onSave: (item: ModelDialogItem) => void;
  item: Model;
  computed: ModelCardComputed;
}) {
  const [currentItem, setCurrentItem] = useState<ModelDialogItem>();
  const [notes, setNotes] = useState(props.item.metadata.notes);
  const [lightbox, setLightbox] = useState(-1);
  const [openDescriptionModal, setDescriptionModal] = useState(false);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    setCurrentItem({ ...Clone(props.item), computed: { ...Clone(props.computed) } });
  }, [props.open]);

  const [keenRef, keenInstanceRef] = useKeenSlider({
    drag: true,
    mode: 'free',
    slides: {
      perView: 'auto',
      spacing: 8,
    },
  });

  return (
    <>
      {currentItem && (
        <>
          <Modal open={props.open} onClose={props.onClose} className={`app-modal`} width={`90%`} height={`90%`}>
            <div className="w-full h-full flex flex-col transform overflow-hidden rounded-2xl bg-gray-700 text-white p-6 text-left align-middle shadow-xl transition-all">
              <div className={`flex h-full max-h-[19rem] gap-5`}>
                <div className={`flex flex-col`} style={{ minWidth: '25rem' }}>
                  <p className={`-mt-3 text-sm opacity-50`}>{currentItem.metadata.type}</p>
                  <h3 className="text-3xl mt-0 font-medium leading-10" style={{ wordBreak: 'break-word' }}>
                    {currentItem.computed.name}
                  </h3>
                  <p className={`text-lg opacity-70 mt-2`}>Base: {currentItem.metadata.currentVersion.baseModel}</p>
                  {currentItem.metadata.description && (
                    <Button className={`w-40 mt-4`} onClick={() => setDescriptionModal(true)}>
                      View Description
                    </Button>
                  )}
                  <div className={`relative mt-auto w-full p-4 bg-gray-800`}>
                    <p
                      style={{ zIndex: -1 }}
                      className={`absolute left-0 -top-5 rounded-lg px-4 py-1 pb-4 text-sm bg-gray-800`}
                    >
                      Notes
                    </p>
                    <textarea
                      className={`bg-transparent resize-none w-full outline-0`}
                      value={notes}
                      onInput={(e) => setNotes(e.currentTarget.value)}
                      rows={3}
                    ></textarea>
                  </div>
                </div>
                <div className={`flex gap-2 w-full`}>
                  <TagList tags={currentItem.metadata.currentVersion.triggers} label={`Triggers`} />
                  <TagList tags={currentItem.metadata.currentVersion.merges} label={`Merges`} />
                  <TagList tags={currentItem.metadata.tags} label={`Tags`} />
                </div>
              </div>
              <div className={`overflow-auto`}>
                <div ref={keenRef} className={`keen-slider w-full h-[18rem] mt-8`}>
                  {currentItem.metadata.currentVersion.images?.map((x, index) => (
                    <div className={`keen-slider__slide w-auto shrink-0 grow-0 basis-auto relative`} key={x.url}>
                      {(currentItem!.metadata.coverImage
                        ? currentItem!.metadata.coverImage!.url === x.url
                        : index === 0) && <div className={`absolute inset-0 z-[100] border-4 border-white`}></div>}
                      <Image
                        item={x}
                        fit={`height`}
                        onClick={() => setLightbox(index)}
                        onLoad={() => {
                          setTimeout(() => {
                            keenInstanceRef.current?.update();
                          }, 50);
                        }}
                        onSetAsCover={() => {
                          currentItem.metadata.coverImage = x;
                          forceUpdate();
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-auto flex items-center justify-end gap-2 pt-5">
                <p className={`absolute bottom-4 left-4 text-sm opacity-70 select-text whitespace-pre`}>
                  {currentItem.file ? (
                    <>
                      {currentItem.file}
                      {currentItem.hash && (
                        <span>
                          {Separator}Hash: {currentItem.hash}
                        </span>
                      )}
                      {currentItem.metadata.creator && (
                        <span>
                          {Separator}Creator: {currentItem.metadata.creator}
                        </span>
                      )}
                    </>
                  ) : (
                    'File not available'
                  )}
                </p>

                <Button onClick={() => props.onClose()}>CLOSE</Button>
                <Button onClick={() => props.onSave(currentItem)}>SAVE</Button>
              </div>
            </div>
          </Modal>
          <Lightbox index={lightbox} onChange={setLightbox} images={currentItem.metadata.currentVersion.images ?? []} />
          <Modal
            className={`z-[6666]`}
            width={`60%`}
            height={`60%`}
            open={openDescriptionModal}
            onClose={() => setDescriptionModal(false)}
            withCloseButton={true}
          >
            <div
              className={`flex flex-col overflow-auto`}
              dangerouslySetInnerHTML={{ __html: currentItem.metadata.description ?? '' }}
            ></div>
          </Modal>
        </>
      )}
    </>
  );
}
