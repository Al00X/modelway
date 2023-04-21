import { useCallback, useEffect, useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import { atom, useAtom, useAtomValue } from 'jotai';
import { ModelExtended, ModelImage } from '@/interfaces/models.interface';
import { TagList } from '@/components/TagList/TagList';
import { Image } from '@/components/Image/Image';
import { Button, ButtonClickEvent } from '@/components/Button/Button';
import { Modal } from '@/components/Modal/Modal';
import { ImageDetailsDialog } from '@/dialog/image-details-dialog/ImageDetailsDialog';
import { importAssets } from '@/services/storage';
import Input from '@/components/Input/Input';
import { clipboardSet } from '@/services/clipboard';
import { openExternalModelLink, openExternalUser } from '@/services/shell';
import './ModelDetailsDialog.scss';
import { clone, mergeArray } from '@/helpers/native.helper';
import { DataState } from '@/states/Data';
import { useAppContext } from '@/context/App';

const SEPARATOR = `    .    `;

const ATOM_FORM_DEFAULT = {
  notes: '' as string,
  cover: undefined as ModelImage | undefined,
  triggers: [] as string[],
  merges: [] as string[],
  tags: [] as string[],
};
const formAtom = atom(ATOM_FORM_DEFAULT);

export const ModelDetailsDialog = (props: {
  open: boolean;
  onClose: () => void;
  onSave: (item: ModelExtended, closed: boolean) => void;
  item: ModelExtended | undefined;
  onSync: (e: ButtonClickEvent, fileName: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<ModelExtended>();
  const [lightbox, setLightbox] = useState(-1);
  const [openDescriptionModal, setOpenDescriptionModal] = useState(false);
  const [openWrongModelModal, setOpenWrongModelModal] = useState(false);
  const [inputManualSyncLink, setInputManualSyncLink] = useState('');
  const [atomForm, setAtomForm] = useAtom(formAtom);

  const atomMergesList = useAtomValue(DataState.availableMergesKeyValue);
  const atomTagsList = useAtomValue(DataState.availableTagsKeyValue);

  const appContext = useAppContext();

  useEffect(() => {
    setTimeout(() => {
      setOpen(props.open && !!props.item);
    }, 10);
    if (props.item) {
      console.log(props.item);
      setCurrentItem(clone(props.item));
      setAtomForm({
        cover: props.item.metadata.coverImage,
        notes: props.item.metadata.notes ?? '',
        merges: mergeArray(atomForm.merges ?? [], props.item.metadata.currentVersion.merges?.filter((x) => !!x) ?? []),
        tags: mergeArray(atomForm.tags ?? [], props.item.metadata.tags?.filter((x) => !!x) ?? []),
        triggers: mergeArray(
          atomForm.triggers ?? [],
          props.item.metadata.currentVersion.triggers?.filter((x) => !!x) ?? [],
        ),
      });
      updateKeenSize();
    }
  }, [props.open, props.item, setAtomForm]);

  useEffect(() => {
    if (!open) {
      setAtomForm(ATOM_FORM_DEFAULT);
    }
  }, [open]);

  const [keenRef, keenInstanceRef] = useKeenSlider({
    drag: true,
    mode: 'free',
    slides: {
      perView: 'auto',
      spacing: 8,
    },
  });

  const updateKeenSize = useCallback(() => {
    setTimeout(() => {
      keenInstanceRef.current?.update();
    }, 50);
  }, [keenInstanceRef.current]);

  const onSave = useCallback(
    (close: boolean) => {
      if (!currentItem) return;

      let itemToSave = currentItem;

      if (close) {
        console.log(atomForm);
        itemToSave = {
          ...itemToSave,
          metadata: {
            ...itemToSave.metadata,
            coverImage: atomForm.cover,
            notes: atomForm.notes,
            tags: atomForm.tags,
            currentVersion: {
              ...itemToSave.metadata.currentVersion,
              merges: atomForm.merges,
              triggers: atomForm.triggers,
            },
          },
        };
      }
      console.log(itemToSave);
      props.onSave(itemToSave, close);
      if (close) {
        props.onClose();
      }
    },
    [currentItem, props.onSave, props.onClose, atomForm],
  );

  return (
    <>
      {!!currentItem && (
        <>
          <Modal
            open={open}
            className={`app-modal`}
            width={`90%`}
            height={`90%`}
            dropzone={{ 'image/*': ['.png', '.gif', '.webp', '.jpg', '.jpeg'] }}
            onClose={props.onClose}
            onDrop={(e) => {
              return importAssets(e).then((assets) => {
                setCurrentItem({
                  ...currentItem,
                  metadata: {
                    ...currentItem.metadata,
                    currentVersion: {
                      ...currentItem.metadata.currentVersion,
                      images: [...(currentItem.metadata.currentVersion.images ?? []), ...assets],
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
            <div className={`flex h-full max-h-[19rem] gap-5 mt-5`}>
              <Button
                className={`absolute top-4 right-6 text-xs h-6 bg-primary-700 hover:bg-primary-600 tracking-widest w-32`}
                onClick={(e) => {
                  props.onSync(e, currentItem.filename);
                }}
              >
                SYNC
              </Button>
              <div className={`flex flex-col relative`} style={{ minWidth: '25rem' }}>
                <div className={`flex flex-col relative w-full`}>
                  <p className={`-mt-3 text-sm opacity-50`}>{currentItem.metadata.type}</p>
                  <h3 className="text-3xl mt-0 font-medium leading-10" style={{ wordBreak: 'break-word' }}>
                    {currentItem.computed.name}
                  </h3>
                  <p className={`text-lg opacity-70 mt-2`}>Version: {currentItem.computed.version ?? '-'}</p>
                  <p className={`text-lg opacity-70 mt-2`}>
                    Base: {currentItem.metadata.currentVersion.baseModel ?? '-'}
                  </p>
                  {!!currentItem.metadata.description && (
                    <Button
                      className={`w-40 absolute right-0 bottom-1 self-end`}
                      onClick={() => {
                        setOpenDescriptionModal(true);
                      }}
                    >
                      View Description
                    </Button>
                  )}
                </div>
                <div className={`relative mt-auto w-full p-4 bg-gray-800`}>
                  <p
                    style={{ zIndex: -1 }}
                    className={`absolute left-0 -top-5 rounded-lg px-4 py-1 pb-4 text-sm bg-gray-800`}
                  >
                    Notes
                  </p>
                  <textarea
                    className={`bg-transparent resize-none w-full outline-0`}
                    value={atomForm.notes}
                    rows={3}
                    onInput={(e) => {
                      setAtomForm((v) => ({ ...v, notes: e.currentTarget.value }));
                    }}
                  ></textarea>
                </div>
              </div>
              <div className={`flex gap-2 w-full mt-3`}>
                <TagList
                  tags={atomForm.triggers}
                  label={`Triggers`}
                  onTags={(e) => {
                    setAtomForm((v) => ({ ...v, triggers: e }));
                  }}
                />
                <TagList
                  tags={atomForm.merges}
                  autoCompleteList={atomMergesList}
                  label={`Merges`}
                  onTags={(e) => {
                    setAtomForm((v) => ({ ...v, merges: e }));
                  }}
                />
                <TagList
                  tags={atomForm.tags}
                  autoCompleteList={atomTagsList}
                  label={`Tags`}
                  onTags={(e) => {
                    setAtomForm((v) => ({ ...v, tags: e }));
                  }}
                />
              </div>
            </div>
            <div className={`overflow-auto`}>
              <div className={`w-full h-[18rem] mt-4 p-3 bg-gray-800`}>
                <div ref={keenRef} className={`keen-slider w-full h-full`}>
                  {(currentItem.metadata.currentVersion.images?.length ?? 0) === 0 && (
                    <div className={`flex items-center justify-center text-lg w-full opacity-20`}>
                      No image available
                    </div>
                  )}
                  {currentItem.metadata.currentVersion.images?.map((x, index) => (
                    <div className={`keen-slider__slide w-auto shrink-0 grow-0 basis-auto relative`} key={x.url}>
                      {!!(atomForm.cover ? atomForm.cover.url === x.url : index === 0) && (
                        <div
                          className={`absolute inset-0 z-[49] border-4 border-white pointer-events-none`}
                          style={{
                            boxShadow: 'rgb(0 0 0 / 40%) 0px 0px 10px 2px inset',
                            filter: 'drop-shadow(0px 0px 5px black)',
                          }}
                        >
                          <div
                            className={`inline-block absolute -top-1 text-2xs text-black bg-white font-bold pl-1 pr-2`}
                          >
                            COVER
                          </div>
                        </div>
                      )}
                      <Image
                        item={x}
                        fit={`height`}
                        onClick={() => {
                          setLightbox(index);
                        }}
                        onLoad={() => {
                          if (!x.width || !x.height) {
                            updateKeenSize();
                          }
                        }}
                        onSetAsCover={() => {
                          setAtomForm((v) => ({ ...v, cover: x }));
                        }}
                        onUpdate={() => {
                          onSave(false);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-auto flex items-center justify-end gap-2 pt-5">
              <p className={`absolute bottom-4 left-4 text-sm opacity-70 select-text whitespace-pre`}>
                {currentItem.filename ? (
                  <>
                    {currentItem.filename}
                    {((vae) => (
                      <span
                        className={`info-chips ${
                          vae === 'external' ? 'active' : vae === 'baked' ? 'alt' : vae === 'missing' ? 'error' : ''
                        }`}
                        title={
                          vae === 'external'
                            ? currentItem.vaePath
                            : vae === 'baked'
                            ? 'This model has a VAE baked inside'
                            : vae === 'missing'
                            ? "You missed the VAE shipped with this model, click to open model's webpage"
                            : 'This model has no custom VAE'
                        }
                      >
                        {vae === 'external'
                          ? 'VAE'
                          : vae === 'baked'
                          ? 'Baked VAE'
                          : vae === 'missing'
                          ? 'Missing VAE'
                          : 'No VAE'}
                      </span>
                    ))(currentItem.computed.hasVAE)}
                    <span
                      className={`info-chips ${currentItem.configPath ? 'active text-primary-200 ' : ''}`}
                      title={currentItem.configPath ?? 'This model has no Config file beside its file'}
                    >
                      {currentItem.configPath ? 'Config' : 'No Config'}
                    </span>
                    {!!currentItem.hash && (
                      <>
                        <span className={`select-none`}>{SEPARATOR}</span>
                        <span
                          title={`Click to copy`}
                          role={`button`}
                          tabIndex={-1}
                          className={`cursor-pointer`}
                          onClick={() => {
                            clipboardSet(currentItem.hash);
                          }}
                        >
                          Hash: {currentItem.hash}
                        </span>
                      </>
                    )}
                    {!!currentItem.metadata.creator && (
                      <>
                        <span className={`select-none`}>{SEPARATOR}</span>
                        <span
                          title={`Click to open link`}
                          tabIndex={-1}
                          role={`link`}
                          className={`cursor-pointer`}
                          onClick={() => {
                            openExternalUser(currentItem.metadata.creator!);
                          }}
                        >
                          Creator: {currentItem.metadata.creator}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  'File not available'
                )}
              </p>
              <span
                tabIndex={0}
                role={`link`}
                className={`text-sm underline opacity-50 mr-6 cursor-pointer self-end`}
                onClick={() => {
                  setOpenWrongModelModal(true);
                }}
              >
                Manually Set Sync URL
              </span>
              <Button
                onClick={() => {
                  props.onClose();
                }}
              >
                CLOSE
              </Button>
              <Button
                onClick={() => {
                  onSave(true);
                }}
              >
                SAVE
              </Button>
            </div>
          </Modal>
          <Modal
            withCloseButton
            title={`Description`}
            className={`z-[6666]`}
            width={`60%`}
            height={`60%`}
            open={openDescriptionModal}
            onClose={() => {
              setOpenDescriptionModal(false);
            }}
          >
            <div
              className={`description-panel mt-3 leading-9`}
              dangerouslySetInnerHTML={{ __html: currentItem.metadata.description ?? '' }}
            ></div>
          </Modal>
          <Modal
            withCloseButton
            className={`z-[6666]`}
            width={`30rem`}
            height={`auto`}
            open={openWrongModelModal}
            title={`Enter a valid CivitAI link for this model :`}
            onClose={() => {
              setOpenWrongModelModal(false);
            }}
          >
            <Input
              className={`w-full mt-4`}
              value={inputManualSyncLink}
              placeholder={`Input here...`}
              onValue={(v) => {
                setInputManualSyncLink(v);
              }}
            />
            <div className={`flex items-center justify-end mt-4`}>
              <span
                role={`link`}
                tabIndex={-1}
                className={`mr-auto opacity-40 text-sm whitespace-pre ${
                  currentItem.metadata.id ? 'underline cursor-pointer' : ''
                }`}
                onClick={() => {
                  if (!currentItem.metadata.id) return;
                  openExternalModelLink(currentItem.metadata.id);
                }}
              >
                Current ID: {currentItem.metadata.id ?? 'N/A'}
              </span>
              <Button>SAVE</Button>
            </div>
          </Modal>
          <ImageDetailsDialog
            open={lightbox}
            images={currentItem.metadata.currentVersion.images ?? []}
            onClose={() => {
              setLightbox(-1);
            }}
          />
        </>
      )}
    </>
  );
};
