import { NoteSearchPreview } from "./noteSearchPreview";

export interface SearchQueryResult {
    notes: NoteSearchPreview[];
    error: Error | undefined;
    isLoading: boolean;
}