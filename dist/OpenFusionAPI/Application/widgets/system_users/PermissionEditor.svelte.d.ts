export default PermissionEditor;
type PermissionEditor = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const PermissionEditor: import("svelte").Component<{
    ctrl?: Record<string, any>;
}, {}, "ctrl">;
type $$ComponentProps = {
    ctrl?: Record<string, any>;
};
