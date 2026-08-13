export default History;
type History = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
} & {
    fetchData: () => Promise<void>;
};
declare const History: import("svelte").Component<{
    task?: Record<string, any>;
}, {
    fetchData: () => Promise<void>;
}, "task">;
type $$ComponentProps = {
    task?: Record<string, any>;
};
