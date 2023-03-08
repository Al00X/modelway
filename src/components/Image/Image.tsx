import {ModelImage} from "@/interfaces/models.interface";
import './Image.scss';

export default function Image(props: { item: ModelImage }) {
    return <div className={`model-image`}>
        <img src={`assets://${props.item.url}`} width={props.item.width} alt="" />
    </div>
}
