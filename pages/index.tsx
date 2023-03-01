import Head from "next/head"
import {Container} from "react-bootstrap";
import Sidebar from "@/components/Sidebar";
import {useState} from "react";
import useSWR from "swr"
import {Note} from "@prisma/client";
import Editor from "@/components/Editor";

export const fetcher = (input: RequestInfo, init: RequestInit) => fetch(input, init).then((res) => res.json());

export default function Home() {
    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);

    const {
        data: notes,
        mutate: mutateNotes,
        error,
        isLoading,
    } = useSWR<Omit<Note, "content">[]>("/api/notes", fetcher);

    // TODO: error handling
    if (error && notes === undefined) {
        return <div>failed to load</div>
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
            await mutateNotes([...notes].map(n => {
                if (n.id === selectedNoteId) {
                    n.title = title;
                }
                return n;
            }));
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
                    onNoteSelectChange={setSelectedNoteId}/>
                <main className="home-main">
                    <Container className="pt-3">
                        <Editor selectedNoteId={selectedNoteId}
                                disabled={isLoading}
                                onDelete={handleDelete}
                                onTitleChange={handleTitleChange}/>
                    </Container>
                </main>
            </div>
        </>
    );
}
