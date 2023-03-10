import Icon from "@/components/Icon/Icon";
import {useRef, useState} from "react";

export default function Input(props: {
    placeholder?: string;
    icon?: string;
    value?: string;
    onValue?: (e: string) => void;
    clearable?: boolean;
    debounce?: number;
    className?: string;
}) {
    const [input, setInput] = useState(props.value);
    const timeoutRef = useRef<any>(null);

    function onInputChange(e: string) {
        setInput(e);

        const changeFn = () => props.onValue ? props.onValue(e) : null;
        if (props.debounce) {
            clearTimeout(timeoutRef.current);
            setTimeout(() => {
                changeFn();
            }, props.debounce)
        } else {
            changeFn();
        }
    }

    function clearInput() {
        setInput('');
        props.onValue ? props.onValue('') : null;
    }

    return <div className={`w-full h-full flex items-center bg-gray-600 text-white rounded-lg gap-4 p-2 ${props.className ?? ''}`}>
        {props.icon && <Icon className={`flex-none ml-2`} icon={props.icon} size={`1rem`} />}
        <input className={`bg-transparent w-full outline-0`} value={input} onInput={(e) => onInputChange(e.currentTarget.value)} placeholder={props.placeholder}/>
        {props.clearable && <div className={`w-6 flex-none`}>
            <Icon onCLick={() => clearInput()} className={`transition-all cursor-pointer ${input ? 'w-6' : 'w-0'}`} icon={'close'} />
        </div>}
    </div>
}
