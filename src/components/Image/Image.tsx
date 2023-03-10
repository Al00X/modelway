import {ModelImage} from "@/interfaces/models.interface";
import './Image.scss';
import {ResolveImage} from "@/services/image-asset";

export default function Image(props: { item: ModelImage, fit?: 'width' | 'height', onClick?: () => void; }) {
    return <div onClick={props.onClick} className={`model-image ${props.fit === 'width' ? 'fit-width' : props.fit === 'height' ? 'fit-height' : ''} ${props.onClick ? 'cursor-pointer' : ''}`}>
        <img src={ResolveImage(props.item)} width={props.item.width} alt="" />
    </div>
}
