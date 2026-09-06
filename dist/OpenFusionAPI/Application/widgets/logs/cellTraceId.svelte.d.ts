export default CellTraceId;
type CellTraceId = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const CellTraceId: import("svelte").Component<{
    value?: any;
    row?: any;
    onOpenTrace?: any;
}, {}, "value" | "row">;
type $$ComponentProps = {
    value?: any;
    row?: any;
    onOpenTrace?: any;
};
