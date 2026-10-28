export default Index;
type Index = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const Index: import("svelte").Component<{
    idapp?: number;
    onsavedeploy?: (app: import("../../../types/models.js").AppRow) => void;
}, {}, "idapp">;
type $$ComponentProps = {
    idapp?: number;
    onsavedeploy?: (app: {
        idapp?: string | number | undefined;
        app?: string | undefined;
        description?: string | undefined;
        enabled?: boolean | undefined;
        rowkey?: number | undefined;
        endpoint?: string | undefined;
        endpoints?: import("../../../types/models.js").EndpointRow[] | undefined;
        jwt_key?: string | undefined;
    }) => void;
};
