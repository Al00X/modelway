import {Loader as LoaderMantine} from "@mantine/core";

export default function Loader() {
    return <LoaderMantine className={`h-full loader stroke-white`} variant={`oval`} />
}
