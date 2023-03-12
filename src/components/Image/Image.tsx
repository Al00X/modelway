import { ModelImage } from '@/interfaces/models.interface';
import './Image.scss';
import { ResolveImage } from '@/services/image-asset';
import { useAtom } from 'jotai';
import { SettingsState } from '@/states/Settings';

export default function Image(props: { item: ModelImage; fit?: 'width' | 'height'; onClick?: () => void }) {
  const [isNSFW, setNSFW] = useAtom(SettingsState.isNSFWToggled);

  return (
    <div
      onClick={props.onClick}
      className={`model-image ${props.fit === 'width' ? 'fit-width' : props.fit === 'height' ? 'fit-height' : ''} ${
        props.onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className={`transition-all absolute inset-0 pointer-events-none ${!isNSFW && props.item.nsfw ? 'blurry' : ''}`}></div>
      <img src={ResolveImage(props.item)} width={props.item.width} alt="" />
    </div>
  );
}
