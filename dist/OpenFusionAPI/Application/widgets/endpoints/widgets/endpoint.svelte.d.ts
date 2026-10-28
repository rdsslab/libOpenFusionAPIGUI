export default Endpoint;
type Endpoint = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<{
        endpoint?: EndpointRow | undefined;
        app?: AppRow | undefined;
        validateResource?: boolean | undefined;
        availableURL?: boolean | undefined;
        oncopy?: ((result: unknown) => void) | undefined;
    }>): void;
};
declare const Endpoint: import("svelte").Component<{
    endpoint?: import("../../../../types/models.js").EndpointRow;
    app?: import("../../../../types/models.js").AppRow;
    validateResource?: boolean;
    availableURL?: boolean;
    oncopy?: (result: unknown) => void;
}, {}, "endpoint" | "app" | "validateResource" | "availableURL">;
