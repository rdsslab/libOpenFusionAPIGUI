export default CellStatusCode;
type CellStatusCode = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const CellStatusCode: import("svelte").Component<{
    value?: any;
    row?: any;
}, {}, "value" | "row">;
type $$ComponentProps = {
    value?: any;
    row?: any;
};
