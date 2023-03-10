import {ModelImage} from "@/interfaces/models.interface";
import Lightbox18 from "react-18-image-lightbox";
import {ResolveImage} from "@/services/image-asset";

export default function Lightbox({index = -1, ...props}: {
    index?: number;
    images: ModelImage[];
    onChange?: (e: number) => void;
}) {
    return (
        <div>
            {index !== -1 && (
                <Lightbox18
                    mainSrc={ResolveImage(props.images[index])}
                    nextSrc={ResolveImage(props.images[(index + 1) % props.images.length])}
                    prevSrc={ResolveImage(props.images[(index + props.images.length - 1) % props.images.length])}
                    onCloseRequest={() => props.onChange ? props.onChange(-1) : null}
                    onMovePrevRequest={() =>
                        props.onChange ? props.onChange((index + props.images.length - 1) % props.images.length) : null
                    }
                    onMoveNextRequest={() =>
                        props.onChange ? props.onChange((index + 1) % props.images.length) : null
                    }
                />
            )}
        </div>
    );
}
