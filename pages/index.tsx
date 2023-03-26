import Head from "next/head"
import {Container} from "react-bootstrap";
import Sidebar from "@/components/Sidebar";
import {useState} from "react";
import Editor from "@/components/Editor";
import {useNotes} from "@/hooks/useNotes";

export default function Home() {
    const {notes, mutateNotes, error, isLoading} = useNotes();

    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
    const [showSidebar, setShowSidebar] = useState(false);

    // TODO: error handling
    if (error && notes === undefined) {
        return <div>failed to load</div>
    }

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
        handleNoteSelect(note.id);
    };

    const handleAddChildNote = async () => {
        if (selectedNoteId == null) {
            return;
        }
        await handleAddNote(selectedNoteId);
    }

    const handleDelete = async () => {
        const parentId = notes?.find(note => note.id === selectedNoteId)?.parentId;

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

    const handleTitleChange = async (title: string) => {
        if (notes !== undefined) {
            await mutateNotes(notes.map(n => {
                if (n.id === selectedNoteId) {
                    return {...n, title}
                }
                return n;
            }));
        }
    };

    const handleNoteSelect = (id: number) => {
        setSelectedNoteId(id);
        setShowSidebar(false);
    }

    return (
        <>
            <Head>
                <title>Fedoc</title>
                <meta name="description" content="Personal Knowledge Database"/>
            </Head>
            <div className="home-layout">
                <Sidebar
                    show={showSidebar}
                    onHide={() => setShowSidebar(false)}
                    selectedNoteId={selectedNoteId}
                    onNoteSelectChange={handleNoteSelect}
                    onNoteAdd={handleAddNote}/>
                <main className="home-main">
                    <Container className="pt-3">
                        <Editor selectedNoteId={selectedNoteId}
                                disabled={isLoading}
                                onDelete={handleDelete}
                                onTitleChange={handleTitleChange}
                                onNotesOpen={() => setShowSidebar(true)}
                                onAddChildNote={handleAddChildNote}/>
                    </Container>
                </main>
            </div>
        </>
    );
}
