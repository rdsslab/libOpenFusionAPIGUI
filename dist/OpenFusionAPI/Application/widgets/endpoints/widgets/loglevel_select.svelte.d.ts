export default LoglevelSelect;
type LoglevelSelect = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const LoglevelSelect: import("svelte").Component<{
    level?: number;
}, {}, "level">;
type $$ComponentProps = {
    level?: number;
};
