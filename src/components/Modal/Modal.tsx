import { Modal as ModalMantine } from '@mantine/core';
import './Modal.scss';
import Icon from '@/components/Icon/Icon';
import { Accept, useDropzone } from 'react-dropzone';

export default function Modal(props: {
  className?: string;
  open: boolean;
  onClose: () => void;
  width?: string;
  height?: string;
  children: any;
  withCloseButton?: boolean;
  dropzone?: Accept;
  onDrop?: (files: any[]) => void;
}) {
  const dropzone = useDropzone({
    accept: props.dropzone,
    noClick: true,
    onDrop: (files) => props.onDrop?.(files)
  });

  return (
    <ModalMantine
      className={`app-modal relative ${props.className ?? ''}`}
      withCloseButton={false}
      classNames={{ overlay: 'bg-black bg-opacity-70 backdrop-filter backdrop-blur-xs' }}
      styles={{ content: { width: props.width ?? '50%', height: props.height ?? '50%' } }}
      centered={true}
      opened={props.open}
      onClose={props.onClose}
    >
      <div
        {...(props.dropzone
          ? dropzone.getRootProps()
          : {})}
        className={`w-full h-full flex flex-col transform overflow-hidden rounded-2xl bg-gray-700 text-white p-6 text-left align-middle shadow-xl transition-all`}
      >
        {props.dropzone && <input {...dropzone.getInputProps({})} />}
        {props.withCloseButton && (
          <>
            <Icon icon={`close`} className={`absolute top-4 right-4 cursor-pointer`} onCLick={props.onClose} />
            <div className={`h-8 flex-none`}></div>
          </>
        )}
        {props.children}
        <div className={`transition-all absolute z-50 bg-black backdrop-filter backdrop-blur-xs bg-opacity-80 inset-0 flex flex-col items-center justify-center pointer-events-none ${dropzone.isDragAccept ? 'opacity-100' : 'opacity-0'}`}>
          <span className={`text-5xl tracking-wide font-semibold`}>Drop Here</span>
          <span className={`text-xl mt-4 opacity-90`}>add it to the gallery</span>
        </div>
      </div>
    </ModalMantine>
  );
}
