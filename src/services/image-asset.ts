import {ModelImage} from "@/interfaces/models.interface";

export function ResolveImage(image: ModelImage | string) {
    const url = typeof image === 'string' ? image : image.url;
    if (url.includes('http')) {
        return url;
    } else {
        return `assets://${url}`;
    }
}
