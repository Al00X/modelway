import { Model, ModelImage } from '@/interfaces/models.interface';
import './ModelCard.scss';
import { useEffect, useState } from 'react';
import Image from '@/components/Image/Image';
import ModelDetailsDialog from "@/dialog/model-details.dialog/ModelDetailsDialog";

export interface ModelCardComputed {
  name: string;
  img: {
    single: ModelImage | null;
    double: ModelImage[];
    triple: ModelImage[];
  }
}

export default function ModelCard(props: { item: Model; wide?: boolean }) {
  const [info, setInfo] = useState<ModelCardComputed>({ name: '', img: { single: null, double: [], triple: []} });
  const [openDetails, setOpenDetails] = useState(false);

  useEffect(() => {
    const imagesArray: ModelImage[] = [];
    for (let i of [props.item.metadata.coverImage, ...(props.item.metadata.currentVersion.images?.slice(0, 3) ?? [])]) {
      if (!i) continue;
      imagesArray.push(i);
    }

    setInfo({
      name:
        props.item.metadata.name ??
        props.item.file.substring(0, props.item.file.lastIndexOf('.')).replaceAll('_', ' ').replaceAll('-', ' '),
      img: {
        single: imagesArray.length > 0 ? imagesArray[0] : null,
        double: imagesArray.length > 1 ? [imagesArray[0], imagesArray[1]] : imagesArray,
        triple: imagesArray,
      }
    });
  }, [props.item]);

  return (
    <>
      <div className={`model-card ${props.wide ? 'wide' : ''}`} onClick={() => setOpenDetails(true)}>
        {!props.wide ? (
            <>
              {info.img.single && <Image item={info.img.single} />}
              <div className={`text-overlay`}>{info.name}</div>
              {props.item.metadata.currentVersion.baseModel && <div
                  className={`absolute left-0 top-0 py-1 px-2 bg-gray-900 text-white text-sm shadow-sm font-medium rounded-br-xl`}>{props.item.metadata.currentVersion.baseModel}</div>}
            </>
        ) : (
            <>
              <div className={`flex w-full h-full`}>
                <div className={`flex flex-col`}>
                  <p className={`text-2xl`}>{info.name}</p>
                  { props.item.metadata.currentVersion.baseModel && <p className={`opacity-60 mt-2`}>Base: {props.item.metadata.currentVersion.baseModel}</p>}
                </div>
                <div className={`flex gap-1 ml-auto max-w-[65%]`}>
                  {info.img.triple?.map(i => <Image key={i.url} item={i} fit={`height`} />)}
                </div>
              </div>
            </>
        )}
      </div>
      <ModelDetailsDialog item={props.item} computed={info} open={openDetails} onClose={() => setOpenDetails(false)} />
    </>
  );
}
