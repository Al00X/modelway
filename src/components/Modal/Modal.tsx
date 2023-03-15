import {Modal as ModalMantine} from "@mantine/core";
import './Modal.scss';
import Icon from "@/components/Icon/Icon";

export default function Modal(props: {
  className?: string;
  open: boolean;
  onClose: () => void;
  width?: string,
  height?: string,
  children: any;
  withCloseButton?: boolean
}) {
  return <ModalMantine
    className={`app-modal relative ${props.className ?? ''}`}
    withCloseButton={false}
    classNames={{ overlay: 'bg-black bg-opacity-70 backdrop-filter backdrop-blur-xs' }}
    styles={{content: { width: props.width ?? '50%', height: props.height ?? '50%' }}}
    centered={true}
    opened={props.open}
    onClose={props.onClose}
  >
    <div className={`w-full h-full flex flex-col transform overflow-hidden rounded-2xl bg-gray-700 text-white p-6 text-left align-middle shadow-xl transition-all`}>
      {props.withCloseButton && <>
        <Icon icon={`close`} className={`absolute top-4 right-4 cursor-pointer`} onCLick={props.onClose} />
        <div className={`h-24`}></div>
      </>}
      {props.children}
    </div>
  </ModalMantine>
}
