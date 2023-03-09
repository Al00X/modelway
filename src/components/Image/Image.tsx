import {ModelImage} from "@/interfaces/models.interface";
import './Image.scss';

export default function Image(props: { item: ModelImage, fit?: 'width' | 'height' }) {
    return <div className={`model-image ${props.fit === 'width' ? 'fit-width' : props.fit === 'height' ? 'fit-height' : ''}`}>
        <img src={`assets://${props.item.url}`} width={props.item.width} alt="" />
    </div>
}
