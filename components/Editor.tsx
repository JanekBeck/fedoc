import {Button, FormControl} from "react-bootstrap";
import NoteOptions from "@/components/NoteOptions";
import {Note} from "@prisma/client";
import {ChangeEvent} from "react";
import useSWR from "swr";
import MenuIcon from "bootstrap-icons/icons/list.svg"
import {fetcher} from "@/lib/fetcher";

export default function Editor(props: {
    selectedNoteId: number | null,
    disabled: boolean,
    onDelete: () => void,
    onTitleChange: (title: string) => void,
    onNotesOpen: () => void,
    onAddChildNote: () => void,
}) {
    const {
        data: currentNote,
        mutate: mutateCurrentNote,
    } = useSWR<Note>(() => props.selectedNoteId != null ? "/api/notes/" + props.selectedNoteId : null, fetcher);

    const handleNoteChange = async (changedNote: Note) => {
        const response = await fetch("/api/notes/" + changedNote.id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(changedNote),
        });

        if (!response.ok) {
            // TODO: error handling
            return;
        }

        const note = await response.json();

        await mutateCurrentNote(note);
    };

    const handleTitleChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (currentNote !== undefined) {
            await handleNoteChange({...currentNote, title: event.currentTarget.value});
            props.onTitleChange(currentNote.title);
        }
    };

    const handleContentChange = async (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (currentNote !== undefined) {
            await handleNoteChange({...currentNote, content: event.currentTarget.value});
        }
    };

    return (
        <>
            <div className="border-bottom d-flex gap-3">
                <Button variant="outline-dark" className="d-sm-none border-0" onClick={props.onNotesOpen}>
                    <MenuIcon width={20} height={20} aria-hidden="true"/>
                </Button>
                <FormControl className="border-0 fs-3"
                             placeholder="Title..."
                             disabled={props.disabled}
                             value={currentNote?.title ?? ""}
                             onChange={handleTitleChange}/>

                <NoteOptions disabled={props.disabled}
                             disabledDelete={currentNote?.parentId === null}
                             noteTitle={currentNote?.title ?? ""}
                             onDelete={props.onDelete}
                             onAddChildNote={props.onAddChildNote}/>
            </div>
            <FormControl as="textarea"
                         className="border-0 home-textarea mt-1"
                         placeholder="Type here..."
                         disabled={props.disabled}
                         value={currentNote?.content ?? ""}
                         onChange={handleContentChange}/>
        </>
    );
}