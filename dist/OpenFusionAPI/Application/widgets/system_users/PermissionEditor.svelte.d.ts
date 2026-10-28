export default PermissionEditor;
type PermissionEditor = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const PermissionEditor: import("svelte").Component<{
    ctrl: import("../../../types/models.js").UserCtrl;
}, {}, "ctrl">;
type $$ComponentProps = {
    ctrl: import("../../../types/models.js").UserCtrl;
};
