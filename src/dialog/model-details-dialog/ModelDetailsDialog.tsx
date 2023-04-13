import { useEffect, useState } from 'react';
import {ModelExtended} from '@/interfaces/models.interface';
import TagList from '@/components/TagList/TagList';
import Image from '@/components/Image/Image';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import { useKeenSlider } from 'keen-slider/react';
import { Clone } from '@/helpers/object.helper';
import { useForceUpdate } from '@mantine/hooks';
import ImageDetailsDialog from '@/dialog/image-details-dialog/ImageDetailsDialog';
import { ImportAssets } from '@/services/storage';
import Input from '@/components/Input/Input';
import {ClipboardSet} from "@/services/clipboard";
import {OpenExternalModelLink, OpenExternalUser} from "@/services/shell";
import './ModelDetailsDialog.scss';


const Separator = `    .    `;

export default function ModelDetailsDialog(props: {
  open: boolean;
  onClose: () => void;
  onSave: (item: ModelExtended, closed: boolean) => void;
  item: ModelExtended | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<ModelExtended>();
  const [notes, setNotes] = useState<string>('');
  const [lightbox, setLightbox] = useState(-1);
  const [openDescriptionModal, setDescriptionModal] = useState(false);
  const [openWrongModelModal, setWrongModelModal] = useState(false);
  const [inputManualSyncLink, setInputManualSyncLink] = useState('');
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    setTimeout(() => {
      setOpen(props.open && !!props.item);
    }, 1);

    setCurrentItem(props.item ? Clone(props.item) : undefined);
    setNotes(props.item?.metadata?.notes ?? '');
  }, [props.open, props.item]);

  const [keenRef, keenInstanceRef] = useKeenSlider({
    drag: true,
    mode: 'free',
    slides: {
      perView: 'auto',
      spacing: 8,
    },
  });

  function updateKeenSize() {
    setTimeout(() => {
      keenInstanceRef.current?.update();
    }, 50);
  }

  function onSave(close: boolean) {
    if (close) {
      props.onClose?.();
    }
    props.onSave?.(currentItem!, close);
  }

  return (
    <>
      {currentItem && (
        <>
          <Modal
            open={open}
            onClose={props.onClose}
            className={`app-modal`}
            width={`90%`}
            height={`90%`}
            dropzone={{ 'image/*': ['.png', '.gif', '.webp', '.jpg', '.jpeg'] }}
            onDrop={(e) => {
              return ImportAssets(e).then((assets) => {
                setCurrentItem({
                  ...currentItem,
                  metadata: {
                    ...currentItem?.metadata,
                    currentVersion: {
                      ...currentItem?.metadata?.currentVersion,
                      images: [...(currentItem?.metadata?.currentVersion?.images ?? []), ...assets],
                    },
                  },
                });
                setTimeout(() => {
                  // TODO: Amo avalan ke save nemishe :|, dovoman kir toosh, tartibe image a beham mikhore...!!!!
                  onSave(false);
                }, 10);
              });
            }}
          >
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
                      : index === 0) && (
                      <div className={`absolute inset-0 z-[49] border-4 border-white pointer-events-none`}></div>
                    )}
                    <Image
                      item={x}
                      fit={`height`}
                      onClick={() => setLightbox(index)}
                      onLoad={() => {
                        updateKeenSize();
                      }}
                      onSetAsCover={() => {
                        setCurrentItem({
                          ...currentItem,
                          metadata: {
                            ...currentItem?.metadata,
                            coverImage: x,
                          },
                        });
                      }}
                      onUpdate={() => {
                        onSave(false);
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
                      <>
                        <span className={`select-none`}>{Separator}</span>
                        <span onClick={() => ClipboardSet(currentItem?.hash)} className={`cursor-pointer`}>Hash: {currentItem.hash}</span>
                      </>
                    )}
                    {currentItem.metadata.creator && (
                      <>
                        <span className={`select-none`}>{Separator}</span>
                        <span onClick={() => OpenExternalUser(currentItem!.metadata.creator!)} className={`cursor-pointer`}>Creator: {currentItem.metadata.creator}</span>
                      </>
                    )}
                  </>
                ) : (
                  'File not available'
                )}
              </p>
              <a
                className={`text-sm underline opacity-50 mr-6 cursor-pointer self-end`}
                onClick={() => setWrongModelModal(true)}
              >
                Wrong synced model
              </a>
              <Button onClick={() => props.onClose()}>CLOSE</Button>
              <Button onClick={() => onSave(true)}>SAVE</Button>
            </div>
          </Modal>
          <Modal
            className={`z-[6666]`}
            width={`60%`}
            height={`60%`}
            open={openDescriptionModal}
            onClose={() => setDescriptionModal(false)}
            withCloseButton={true}
          >
            <div
              className={`description-panel`}
              dangerouslySetInnerHTML={{ __html: currentItem.metadata.description ?? '' }}
            ></div>
          </Modal>
          <Modal
            className={`z-[6666]`}
            width={`30rem`}
            height={`auto`}
            open={openWrongModelModal}
            onClose={() => setWrongModelModal(false)}
            withCloseButton={true}
            title={`Enter a valid CivitAI link for this model :`}
          >
            <Input
              className={`w-full mt-4`}
              value={inputManualSyncLink}
              onValue={(v) => setInputManualSyncLink(v)}
              placeholder={`Input here...`}
            />
            <div className={`flex items-center justify-end mt-4`}>
              {currentItem?.metadata?.id && <p
                className={`mr-auto opacity-40 text-sm underline cursor-pointer`}
                onClick={() => OpenExternalModelLink(currentItem!.metadata!.id!)}
              >
                Current ID: {currentItem.metadata.id}
              </p>}
              <Button>SAVE</Button>
            </div>
          </Modal>
          <ImageDetailsDialog
            open={lightbox}
            onClose={() => setLightbox(-1)}
            images={currentItem.metadata.currentVersion.images ?? []}
          />
        </>
      )}
    </>
  );
}
