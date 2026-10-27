export default RequestDetail;
type RequestDetail = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const RequestDetail: import("svelte").Component<{
    show?: boolean;
    row?: any;
    appName?: string;
}, {}, "show" | "row" | "appName">;
type $$ComponentProps = {
    show?: boolean;
    row?: any;
    appName?: string;
};
