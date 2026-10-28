export default Editor;
type Editor = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
} & {
    setData: (data: any) => void;
};
declare const Editor: import("svelte").Component<{
    showEditor?: boolean;
    onsave?: (d: import("../../../../types/models.js").HandlerChangePayload) => void;
    oncopy?: (ep: import("../../../../types/models.js").EndpointRow) => void;
}, {
    setData: (data: any) => void;
}, "showEditor">;
type $$ComponentProps = {
    showEditor?: boolean;
    onsave?: (d: {
        data_test?: import("../../../../types/models.js").DataTest | undefined;
        code?: string | undefined;
        docs?: string | undefined;
        File?: File | undefined;
        custom_data?: import("../../../../types/models.js").CustomData | undefined;
        resource?: string | undefined;
        method?: string | undefined;
        environment?: string | undefined;
        endpoint?: string | undefined;
    }) => void;
    oncopy?: (ep: {
        idendpoint?: string | undefined;
        idapp?: string | undefined;
        app?: string | undefined;
        endpoint?: string | undefined;
        resource?: string | undefined;
        method?: string | undefined;
        handler?: string | undefined;
        environment?: string | undefined;
        description?: string | undefined;
        code?: string | undefined;
        enabled?: boolean | undefined;
        access?: number | undefined;
        cache_time?: number | undefined;
        rowkey?: number | undefined;
        latest_updater?: string | null | undefined;
        cors?: Record<string, unknown> | undefined;
        headers_test?: Record<string, unknown> | undefined;
        data_test?: import("../../../../types/models.js").DataTest | undefined;
        json_schema?: Record<string, unknown> | undefined;
        mcp?: Record<string, unknown> | undefined;
        ctrl?: import("../../../../types/models.js").UserCtrl | undefined;
        File?: File | undefined;
        params?: Record<string, unknown> | undefined;
        code_js?: string | undefined;
        custom_data?: import("../../../../types/models.js").CustomData | undefined;
        docs?: string | undefined;
        keywords?: string | undefined;
        title?: string | undefined;
        timeout?: number | undefined;
        price_by_request?: number | undefined;
        price_kb_request?: number | undefined;
        price_kb_response?: number | undefined;
    }) => void;
};
