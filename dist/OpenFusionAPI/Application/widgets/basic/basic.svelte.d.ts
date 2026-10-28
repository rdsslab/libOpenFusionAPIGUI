export default Basic;
type Basic = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const Basic: import("svelte").Component<{
    idapp?: number | string;
    onsavedeploy?: (app: import("../../../types/models.js").AppRow) => void;
}, {}, "idapp">;
type $$ComponentProps = {
    idapp?: number | string;
    onsavedeploy?: (app: import("../../../types/models.js").AppRow) => void;
};
