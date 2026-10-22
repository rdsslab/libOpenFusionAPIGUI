export default EndpointLabel;
type EndpointLabel = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const EndpointLabel: import("svelte").Component<{
    environment?: string;
    endpoint?: string;
    method?: string;
    handler?: string;
}, {}, "environment" | "endpoint" | "method" | "handler">;
type $$ComponentProps = {
    environment?: string;
    endpoint?: string;
    method?: string;
    handler?: string;
};
