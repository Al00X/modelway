export default function Section(props: { label?: string, children?: any, className?: string; wrapperClass?: string; }) {
    return <div className={`px-3 py-5 pt-5 rounded-lg bg-gray-800 mt-4 relative ${props.className ?? ''}`}>
        <p className={`absolute -top-4 left-0 opacity-90 bg-gray-800 px-5 rounded-lg text-sm pb-3 pt-1`}>{props.label}</p>
        <div className={`flex flex-wrap overflow-auto -mr-3 p-0.5 ${props.wrapperClass ?? ''}`}>
            {props.children}
        </div>
    </div>
}
