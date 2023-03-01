import Head from "next/head"
import {Container, FormControl} from "react-bootstrap";
import Sidebar from "@/components/Sidebar";
import {ChangeEvent, useState} from "react";
import useSWR from "swr"
import {Note} from "@prisma/client";
import NoteOptions from "@/components/NoteOptions";

export const fetcher = (input: RequestInfo, init: RequestInit) => fetch(input, init).then((res) => res.json());

export default function Home() {
    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);

    const {
        data: notes,
        mutate: mutateNotes,
        error,
        isLoading,
    } = useSWR<Omit<Note, "content">[]>("/api/notes", fetcher);

    const {
        data: currentNote,
        mutate: mutateCurrentNote,
    } = useSWR<Note>(() => selectedNoteId != null ? "/api/notes/" + selectedNoteId : null, fetcher);

    // TODO: error handling
    if (error && notes === undefined) {
        return <div>failed to load</div>
    }

    const handleAddNote = async (parentId: number) => {
        //handleOptionsClose();

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
        setSelectedNoteId(note.id);
    };

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
            if (notes !== undefined) {
                await mutateNotes([...notes].map(n => n.id === currentNote.id ? currentNote : n));
            }
        }
    };

    const handleContentChange = async (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (currentNote !== undefined) {
            await handleNoteChange({...currentNote, content: event.currentTarget.value});
        }
    };

    const handleDelete = async () => {
        const parentId = currentNote?.parentId;

        const response = await fetch("/api/notes/" + selectedNoteId, {
            method: "DELETE",
        });

        if (!response.ok) {
            // TODO: error handling
            return;
        }

        await mutateNotes();
        if (parentId != null) {
            setSelectedNoteId(parentId);
        }
    };

    return (
        <>
            <Head>
                <title>Fedoc</title>
                <meta name="description" content="Personal Knowledge Database"/>
            </Head>
            <div className="home-layout">
                <Sidebar
                    selectedNoteId={selectedNoteId}
                    onNoteSelectChange={setSelectedNoteId}
                    onNoteAdd={handleAddNote}/>
                <main className="home-main">
                    <Container className="pt-3">
                        <div className="border-bottom d-flex gap-3">
                            <FormControl className="border-0 fs-3"
                                         placeholder="Title..."
                                         disabled={isLoading}
                                         value={currentNote?.title ?? ""}
                                         onChange={handleTitleChange}/>

                            <NoteOptions disabled={isLoading}
                                         disabledDelete={currentNote?.parentId === null}
                                         noteTitle={currentNote?.title ?? ""}
                                         onDelete={handleDelete}/>
                        </div>
                        <FormControl as="textarea"
                                     className="border-0 home-textarea mt-1"
                                     placeholder="Type here..."
                                     disabled={isLoading}
                                     value={currentNote?.content ?? ""}
                                     onChange={handleContentChange}/>
                    </Container>
                </main>
            </div>
        </>
    );
}
