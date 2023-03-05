import {Note} from "@prisma/client";
import Header from "@/components/Header";
import {NoteNavList} from "@/components/NoteNavList";
import useSWR from "swr";
import {useEffect, useMemo} from "react";
import {fetcher} from "@/pages";

export default function Sidebar(props: {
    selectedNoteId: number | null,
    onNoteSelectChange: (noteId: number) => void
}) {
    const {data: notes, mutate: mutateNotes} = useSWR<Omit<Note, "content">[]>("/api/notes", fetcher);

    const rootNote = useMemo(() => notes?.find(n => n.parentId === null) ?? null, [notes]);

    useEffect(() => {
        if (props.selectedNoteId == null && rootNote != null) {
            props.onNoteSelectChange(rootNote.id);
        }
    }, [props, rootNote]);

    const handleAddNote = async (parentId: number) => {
        const response = await fetch("/api/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({parentId}),
        });

        if (!response.ok) {
            // TODO: error handling
            return;
        }

        const note = await response.json();

        await mutateNotes();
        props.onNoteSelectChange(note.id);
    };

    return (
        <aside className="home-sidebar flex-shrink-0 bg-dark text-white">
            <Header onNoteSelectChange={props.onNoteSelectChange}/>
            <nav className="px-3" aria-label="Notes navigation">
                {rootNote != null && notes != null &&
                    <NoteNavList
                        notes={notes}
                        noteChildren={[rootNote]}
                        selectedNoteId={props.selectedNoteId}
                        onNoteSelectChange={props.onNoteSelectChange}
                        onNoteAdd={handleAddNote}/>
                }
            </nav>
        </aside>
    )
}
