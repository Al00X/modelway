import { Modal as ModalMantine } from '@mantine/core';
import './Modal.scss';
import { Accept, useDropzone } from 'react-dropzone';
import { Icon } from '@/components/Icon/Icon';

export const Modal = (props: {
  className?: string;
  open: boolean;
  onClose: () => void;
  width?: string;
  height?: string;
  children: any;
  title?: string;
  withCloseButton?: boolean;
  dropzone?: Accept;
  onDrop?: (files: any[]) => void;
}) => {
  const dropzone = useDropzone({
    accept: props.dropzone,
    noClick: true,
    onDrop: (files) => props.onDrop?.(files),
  });

  return (
    <ModalMantine
      centered
      className={`app-modal relative ${props.className ?? ''}`}
      withCloseButton={false}
      classNames={{ overlay: 'bg-black bg-opacity-70 backdrop-filter backdrop-blur-xs filter-blur-none' }}
      styles={{ content: { width: props.width ?? '50%', height: props.height ?? '50%' } }}
      opened={props.open}
      onClose={props.onClose}
    >
      <div
        {...(props.dropzone ? dropzone.getRootProps() : {})}
        className={`w-full h-full flex flex-col transform overflow-hidden rounded-2xl bg-gray-700 text-white p-6 text-left align-middle shadow-xl transition-all outline-0`}
      >
        {!!props.dropzone && <input {...dropzone.getInputProps({})} />}
        {!!(props.withCloseButton ?? props.title) && (
          <>
            {!!props.title && <p className={`absolute top-4 left-6 text-xl font-semibold`}>{props.title}</p>}
            <Icon icon={`close`} className={`absolute top-4 right-6 cursor-pointer`} onClick={props.onClose} />
            <div className={`h-8 flex-none`}></div>
          </>
        )}
        {props.children}
        <div
          className={`transition-all absolute z-50 bg-black backdrop-filter backdrop-blur-xs filter-blur-none bg-opacity-80 inset-0 flex flex-col items-center justify-center pointer-events-none ${
            dropzone.isDragAccept ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className={`text-5xl tracking-wide font-semibold`}>Drop Here</span>
          <span className={`text-xl mt-4 opacity-90`}>add it to the gallery</span>
        </div>
      </div>
    </ModalMantine>
  );
};
