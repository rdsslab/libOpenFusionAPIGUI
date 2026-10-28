export default Chat;
type Chat = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<{
        class_content?: string | undefined;
        onmessage?: ((e: {
            message: string;
        }) => void) | undefined;
        currentChat?: Record<string, unknown> | undefined;
        messages?: ChatMessage[] | undefined;
    }>): void;
};
declare const Chat: import("svelte").Component<{
    class_content?: string;
    onmessage?: (e: {
        message: string;
    }) => void;
    currentChat?: Record<string, unknown>;
    messages?: Array<import("../../../../../types/models.js").ChatMessage>;
}, {}, "class_content" | "currentChat" | "messages">;
