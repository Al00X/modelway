import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Model } from '@/interfaces/models.interface';
import { ModelCardComputed } from '@/components/ModelCard/ModelCard';
import TagList from '@/components/TagList/TagList';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import Image from '@/components/Image/Image';
import { FreeMode, Mousewheel, Scrollbar } from 'swiper';
import Button from '@/components/Button/Button';

export default function ModelDetailsDialog(props: {
  open: boolean;
  onClose: () => void;
  item: Model;
  computed: ModelCardComputed;
}) {
  const [notes, setNotes] = useState(props.item.metadata.notes);

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
      console.log(swiperRef);
      window.addEventListener('mousewheel', onMouseWheel);
      // window.addEventListener( 'DOMMouseScroll', onMouseWheel );
    }
    return () => {
      window.removeEventListener('mousewheel', onMouseWheel);
    };
  }, [props.open]);

  return (
    <Transition appear show={props.open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => props.onClose()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-25 pointer-events-none"
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-[90%] h-[90%] flex flex-col transform overflow-hidden rounded-2xl bg-gray-700 text-white p-6 text-left align-middle shadow-xl transition-all">
                <div className={`flex h-full max-h-[19rem] gap-4`}>
                  <div className={`flex flex-col`} style={{ minWidth: '20rem' }}>
                    <h3 className="text-3xl font-medium leading-10" style={{ wordBreak: 'break-word' }}>
                      {props.computed.name}
                    </h3>
                    <p className={`text-lg opacity-70 mt-2`}>Base: {props.item.metadata.baseModel}</p>
                    <div className={`relative mt-auto w-full p-4 bg-gray-800`}>
                      <p style={{zIndex: -1}} className={`absolute left-0 -top-5 rounded-lg px-4 py-1 pb-4 text-sm bg-gray-800`}>Notes</p>
                      <textarea
                        className={`bg-transparent resize-none w-full outline-0`}
                        value={notes}
                        onInput={(e) => setNotes(e.currentTarget.value)}
                        rows={3}
                      ></textarea>
                    </div>
                  </div>
                  <TagList tags={props.item.metadata.triggers} label={`Triggers`} />
                  <TagList tags={props.item.metadata.merges} label={`Merges`} />
                </div>
                <div>
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
                    {props.item.metadata.images?.map((x) => (
                      <SwiperSlide className={`w-auto`} key={x.url}>
                        <Image item={x} fit={`height`} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                <div className="mt-auto flex items-center justify-end gap-2 pt-5">
                  <Button onClick={() => props.onClose()}>CLOSE</Button>
                  <Button onClick={() => props.onClose()}>SAVE</Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
