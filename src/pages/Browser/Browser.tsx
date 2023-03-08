import {useAppContext} from "@/context/app.context";
import {useEffect, useState} from "react";
import {Model, ModelType} from "@/interfaces/models.interface";
import Loader from "@/components/Loader/Loader";
import ModelCard from "@/components/ModelCard/ModelCard";

export default function Browser() {
    const [category, setCategory] = useState<ModelType>('Checkpoint');
    const [list, setList] = useState<Model[] | undefined>(undefined);
    const appContext = useAppContext();

    useEffect(() => {
        setList(appContext.list[category] ?? []);
        console.log(appContext);
    }, [category, appContext.list]);

    return <div className={`w-full h-full flex gap-1 flex-wrap`}>
        {!list ? <Loader /> : list.map(item => <ModelCard item={item} />)}
    </div>
}
