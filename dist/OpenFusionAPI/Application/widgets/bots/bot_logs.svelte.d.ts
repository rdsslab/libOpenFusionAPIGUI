export default BotLogs;
type BotLogs = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const BotLogs: import("svelte").Component<{
    idbot?: any;
    hours?: number;
}, {}, "idbot">;
type $$ComponentProps = {
    idbot?: any;
    hours?: number;
};
