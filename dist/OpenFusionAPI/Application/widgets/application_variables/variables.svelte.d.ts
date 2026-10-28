export default Variables;
type Variables = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<{
        idapp?: number | undefined;
        environment?: string | undefined;
        isReadOnly?: boolean | undefined;
        onchange?: ((vars: unknown) => void) | undefined;
    }>): void;
};
declare const Variables: import("svelte").Component<{
    idapp?: number;
    environment?: string;
    isReadOnly?: boolean;
    onchange?: (vars: unknown) => void;
}, {}, "idapp" | "isReadOnly" | "environment">;
