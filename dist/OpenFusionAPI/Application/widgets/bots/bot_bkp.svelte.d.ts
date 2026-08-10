export default BotBkp;
type BotBkp = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const BotBkp: import("svelte").Component<{
    idbot?: any;
    onselect?: Function;
}, {}, "idbot">;
type $$ComponentProps = {
    idbot?: any;
    onselect?: Function;
};
