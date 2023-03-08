export function until(conditionFunction: () => boolean) {
    const poll = (resolve: (v: any) => void) => {
        if(conditionFunction()) resolve(null);
        else setTimeout(_ => poll(resolve), 10);
    }

    return new Promise(poll);
}
