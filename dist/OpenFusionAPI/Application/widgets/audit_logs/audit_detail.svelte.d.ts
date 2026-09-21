export default AuditDetail;
type AuditDetail = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const AuditDetail: import("svelte").Component<{
    show?: boolean;
    detail?: any;
    loading?: boolean;
}, {}, "show" | "detail" | "loading">;
type $$ComponentProps = {
    show?: boolean;
    detail?: any;
    loading?: boolean;
};
