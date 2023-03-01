import Head from "next/head"
import {Button, Container, Dropdown, FormControl, Modal, Placeholder} from "react-bootstrap";
import Sidebar from "@/components/Sidebar";
import {ChangeEvent, useEffect, useMemo, useState} from "react";
import useSWR from "swr"
import ThreeDotsVerticalIcon from "bootstrap-icons/icons/three-dots-vertical.svg"
import {Note} from "@prisma/client";

const fetcher = (input: RequestInfo, init: RequestInit) => fetch(input, init).then((res) => res.json());

export default function Home() {
    const [showOptions, setShowOptions] = useState(false);

    const {
        data: notes,
        mutate: mutateNotes,
        error,
        isLoading,
    } = useSWR<Omit<Note, "content">[]>("/api/notes", fetcher);

    const rootNote = useMemo(() => notes?.find(n => n.parentId === null) ?? null, [notes]);

    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);

    useEffect(() => {
        if (selectedNoteId == null && rootNote != null) {
            setSelectedNoteId(rootNote.id);
        }
    }, [selectedNoteId, rootNote]);

    const {
        data: currentNote,
        mutate: mutateCurrentNote,
    } = useSWR<Note>(() => selectedNoteId != null ? "/api/notes/" + selectedNoteId : null, fetcher);

    // TODO: error handling
    if (error && notes === undefined) {
        return <div>failed to load</div>
    }

    const handleAddNote = async (parentId: number) => {
        handleOptionsClose();

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
    }

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

    const handleOptionsClose = () => setShowOptions(false);

    const handleOptionsShow = () => setShowOptions(true);

    const handleDelete = async () => {
        handleOptionsClose();

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
    }

    return (
        <>
            <Head>
                <title>Fedoc</title>
                <meta name="description" content="Personal Knowledge Database"/>
            </Head>
            <div className="home-layout">
                <Sidebar
                    rootNote={rootNote}
                    notes={notes ?? null}
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

                            <Dropdown>
                                <Dropdown.Toggle variant="outline-dark"
                                                 className="border-0"
                                                 aria-label="Options"
                                                 disabled={isLoading}
                                                 id="options-dropdown">
                                    <ThreeDotsVerticalIcon width={20} height={20} aria-hidden="true"/>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item as="button"
                                                   onClick={handleOptionsShow}
                                                   disabled={currentNote?.parentId === null}>
                                        Delete
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Modal show={showOptions} onHide={handleOptionsClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Delete note</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    Do you really want to delete <span className="fw-bold">{currentNote?.title}</span>?
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleOptionsClose}>
                                        Close
                                    </Button>
                                    <Button variant="danger" onClick={handleDelete}>
                                        Delete
                                    </Button>
                                </Modal.Footer>
                            </Modal>
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
