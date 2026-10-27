export default SaveDeploy;
type SaveDeploy = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const SaveDeploy: import("svelte").Component<{
    left?: any[];
    onsavedeploy?: Function;
    oncancel?: Function;
    deploying?: Record<string, any>;
    dirty?: boolean;
}, {}, "left" | "deploying" | "dirty">;
type $$ComponentProps = {
    left?: any[];
    onsavedeploy?: Function;
    oncancel?: Function;
    deploying?: Record<string, any>;
    dirty?: boolean;
};
