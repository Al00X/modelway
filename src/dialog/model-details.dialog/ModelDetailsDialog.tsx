import { useEffect, useRef, useState } from 'react';
import { Model } from '@/interfaces/models.interface';
import { ModelCardComputed } from '@/components/ModelCard/ModelCard';
import TagList from '@/components/TagList/TagList';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import Image from '@/components/Image/Image';
import { FreeMode, Mousewheel, Scrollbar } from 'swiper';
import Button from '@/components/Button/Button';
import Lightbox from '@/components/Lightbox/Lightbox';
import Modal from '@/components/Modal/Modal';

const Separator = `    .    `;

export default function ModelDetailsDialog(props: {
  open: boolean;
  onClose: () => void;
  item: Model;
  computed: ModelCardComputed;
}) {
  const [notes, setNotes] = useState(props.item.metadata.notes);
  const [lightbox, setLightbox] = useState(-1);
  const [openDescriptionModal, setDescriptionModal] = useState(false);

  const swiperRef = useRef<SwiperRef>(null);

  useEffect(() => {
    let timer: any;
    const onMouseWheel = () => {
      timer ? clearTimeout(timer) : null;
      swiperRef.current?.swiper.el.classList.add('mousewheel-smooth');
      timer = setTimeout(() => {
        swiperRef.current?.swiper.el.classList.remove('mousewheel-smooth');
      }, 100);
    };
    if (props.open) {
      window.addEventListener('mousewheel', onMouseWheel);
      // window.addEventListener( 'DOMMouseScroll', onMouseWheel );
    }
    return () => {
      window.removeEventListener('mousewheel', onMouseWheel);
    };
  }, [props.open]);

  return (
    <>
      <Modal
        open={props.open}
        onClose={props.onClose}
        className={`app-modal`}
        width={`90%`}
        height={`90%`}
      >
        <div className="w-full h-full flex flex-col transform overflow-hidden rounded-2xl bg-gray-700 text-white p-6 text-left align-middle shadow-xl transition-all">
          <div className={`flex h-full max-h-[19rem] gap-5`}>
            <div className={`flex flex-col`} style={{ minWidth: '25rem' }}>
              <p className={`-mt-3 text-sm opacity-50`}>{props.item.metadata.type}</p>
              <h3 className="text-3xl mt-0 font-medium leading-10" style={{ wordBreak: 'break-word' }}>
                {props.computed.name}
              </h3>
              <p className={`text-lg opacity-70 mt-2`}>Base: {props.item.metadata.currentVersion.baseModel}</p>
              {props.item.metadata.description && (
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
              <TagList tags={props.item.metadata.currentVersion.triggers} label={`Triggers`} />
              <TagList tags={props.item.metadata.currentVersion.merges} label={`Merges`} />
              <TagList tags={props.item.metadata.tags} label={`Tags`} />
            </div>
          </div>
          <div className={`overflow-auto`}>
            <Swiper
              ref={swiperRef}
              className={`w-full h-[18rem] mt-8`}
              modules={[Scrollbar, Mousewheel, FreeMode]}
              freeMode={{ sticky: false }}
              speed={300}
              spaceBetween={8}
              slidesPerView={'auto'}
              scrollbar={true}
              mousewheel={{ releaseOnEdges: true, sensitivity: 3 }}
            >
              {props.item.metadata.currentVersion.images?.map((x, index) => (
                <SwiperSlide className={`w-auto`} key={x.url}>
                  <Image item={x} fit={`height`} onClick={() => setLightbox(index)} onLoad={() => {
                    try {
                      setTimeout(() => {
                        swiperRef.current?.swiper.update();
                      }, 10)
                    } catch {}

                  }
                  } />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="mt-auto flex items-center justify-end gap-2 pt-5">
            <p className={`absolute bottom-4 left-4 text-sm opacity-70 select-text whitespace-pre`}>
              {props.item.file ? (
                <>
                  {props.item.file}
                  {props.item.hash && (
                    <span>
                      {Separator}Hash: {props.item.hash}
                    </span>
                  )}
                  {props.item.metadata.creator && (
                    <span>
                      {Separator}Creator: {props.item.metadata.creator}
                    </span>
                  )}
                </>
              ) : (
                'File not available'
              )}
            </p>

            <Button onClick={() => props.onClose()}>CLOSE</Button>
            <Button onClick={() => props.onClose()}>SAVE</Button>
          </div>
        </div>
      </Modal>
      <Lightbox index={lightbox} onChange={setLightbox} images={props.item.metadata.currentVersion.images ?? []} />
      <Modal
        className={`z-[6666]`}
        width={`60%`}
        height={`60%`}
        open={openDescriptionModal}
        onClose={() => setDescriptionModal(false)}
        withCloseButton={true}
      >
        <div className={`flex flex-col overflow-auto`} dangerouslySetInnerHTML={{__html: props.item.metadata.description ?? ''}}>

        </div>
      </Modal>
    </>
  );
}
