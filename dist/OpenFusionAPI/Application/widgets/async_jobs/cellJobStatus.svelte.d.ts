export default CellJobStatus;
type CellJobStatus = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const CellJobStatus: import("svelte").Component<{
    value?: any;
    row?: any;
}, {}, "value" | "row">;
type $$ComponentProps = {
    value?: any;
    row?: any;
};
