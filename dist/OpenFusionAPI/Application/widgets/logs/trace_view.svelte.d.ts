export default TraceView;
type TraceView = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const TraceView: import("svelte").Component<{
    show?: boolean;
    trace_id?: string;
}, {}, "show" | "trace_id">;
type $$ComponentProps = {
    show?: boolean;
    trace_id?: string;
};
