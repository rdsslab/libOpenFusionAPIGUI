export default AsyncWrapper;
type AsyncWrapper = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<{
        endpoint: EndpointRow;
        onchange: (data: HandlerChangePayload) => void;
        app: {
            app?: string | undefined;
            endpoints?: EndpointRow[] | undefined;
        };
    }>): void;
};
declare const AsyncWrapper: import("svelte").Component<{
    endpoint: import("../../../../../types/models.js").EndpointRow;
    onchange: (data: import("../../../../../types/models.js").HandlerChangePayload) => void;
    app: {
        app?: string;
        endpoints?: Array<import("../../../../../types/models.js").EndpointRow>;
    };
}, {}, "endpoint" | "app">;
