import {Model, ModelImage} from "@/interfaces/models.interface";
import './ModelCard.scss';
import {useEffect, useState} from "react";
import Image from "@/components/Image/Image";

export default function ModelCard(props: {
    item: Model
}) {
    const [info, setInfo] = useState<{
        name: string;
        img: ModelImage | null;
    }>({ name: '', img: null });

    useEffect(() => {
        setInfo({
            name: props.item.file.substring(0, props.item.file.lastIndexOf('.')).replaceAll('_', ' '),
            img: props.item.metadata.coverImage ?? ((props.item.metadata.images?.length ?? 0) > 0 ? props.item.metadata.images![0] : null)
        })
    }, [props.item])

    return <div className={`model-card`}>
        {info.img && <Image item={info.img} /> }
        <div className={`text-overlay`}>
            {info.name}
        </div>
    </div>
}
