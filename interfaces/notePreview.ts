import {Note} from "@prisma/client";

export type NotePreview = Omit<Note, "content">;
