import Header from "@/components/Header";
import {NoteNavList} from "@/components/NoteNavList";
import {useMemo} from "react";
import {Offcanvas} from "react-bootstrap";
import {useNotes} from "@/hooks/useNotes";

export default function Sidebar(props: {
    show: boolean,
    onHide: () => void,
    selectedNoteId: number | null,
    onNoteSelectChange: (noteId: number) => void,
    onNoteAdd: (parentId: number) => void,
}) {
    const {notes} = useNotes();

    const rootNote = useMemo(() => notes?.find(n => n.parentId === null) ?? null, [notes]);

    if (props.selectedNoteId == null && rootNote != null) {
        props.onNoteSelectChange(rootNote.id);
    }

    return (
        <aside className="home-sidebar bg-dark text-white">
            <Offcanvas show={props.show} responsive="sm" onHide={props.onHide}>
                <Offcanvas.Header className="bg-dark text-white" closeButton closeVariant="white">
                    <Offcanvas.Title/>
                </Offcanvas.Header>
                <Offcanvas.Body className="d-block home-sidebar bg-dark text-white">
                    <Header onNoteSelectChange={props.onNoteSelectChange}/>
                    <nav className="px-3" aria-label="Notes navigation">
                        {rootNote != null && notes != null &&
                            <NoteNavList
                                notes={notes}
                                noteChildren={[rootNote]}
                                selectedNoteId={props.selectedNoteId}
                                onNoteSelectChange={props.onNoteSelectChange}
                                onNoteAdd={props.onNoteAdd}/>
                        }
                    </nav>
                </Offcanvas.Body>
            </Offcanvas>
        </aside>
    )
}
