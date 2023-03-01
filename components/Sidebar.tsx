import {Button, FormControl, ListGroup, Modal} from "react-bootstrap";
import {useState} from "react";
import AddIcon from "bootstrap-icons/icons/plus-lg.svg"
import SearchIcon from "bootstrap-icons/icons/search.svg"
import {Note} from "@prisma/client";

export default function Sidebar(props: {
    rootNote: Omit<Note, "content"> | null,
    notes: Omit<Note, "content">[] | null,
    selectedNoteId: number | null,
    onNoteSelectChange: (noteId: number) => void,
    onNoteAdd: (parentId: number) => void
}) {
    const [showSearch, setShowSearch] = useState(false);

    const handleSearchClose = () => setShowSearch(false);

    const handleSearchShow = () => setShowSearch(true);

    return (
        <aside className="home-sidebar flex-shrink-0 bg-dark text-white">
            <div className="sidebar-header bg-dark d-flex gap-3 align-items-center p-3 border-bottom border-secondary">
                <span className="fs-5 fw-semibold">Fedoc</span>
                <button type="button"
                        className="btn btn-outline-primary w-100 text-start sidebar-search gap-2 d-flex align-items-center"
                        onClick={handleSearchShow}>
                    <SearchIcon aria-hidden="true"/>
                    Search
                </button>
                <Modal className="mt-5" show={showSearch} onHide={handleSearchClose}>
                    <Modal.Body>
                        <FormControl
                            placeholder="Search notes"
                            autoFocus/>
                        <div className="m-5 text-center text-muted">
                            <p>No recent searches</p>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
            <nav className="px-3" aria-label="Notes navigation">
                {props.rootNote != null && props.notes != null &&
                    <NoteNavList
                        notes={props.notes}
                        noteChildren={[props.rootNote]}
                        selectedNoteId={props.selectedNoteId}
                        onNoteSelectChange={props.onNoteSelectChange}
                        onNoteAdd={props.onNoteAdd}/>
                }
            </nav>
        </aside>
    )
}

function NoteNavList(props: {
    className?: string,
    notes: Omit<Note, "content">[],
    noteChildren: Omit<Note, "content">[],
    selectedNoteId: number | null,
    onNoteSelectChange: (noteId: number) => void,
    onNoteAdd: (parentId: number) => void
}) {
    return (
        <ListGroup as="ul" variant="flush" className={props.className}>
            {props.noteChildren.map(child => (
                <>
                    <ListGroup.Item as="li"
                                    key={child.id}
                                    action
                                    className="d-flex gap-2 nav-list-btn text-nowrap border-0 text-white"
                                    active={props.selectedNoteId === child.id}
                                    onClick={() => props.onNoteSelectChange(child.id)}>
                        {child.title}
                        <Button variant="outline-dark"
                                type="button"
                                aria-label="Add child note"
                                tabIndex={0}
                                className="nav-list-add border-0 py-0 px-1 align-items-center"
                                onClick={() => props.onNoteAdd(child.id)}>
                            <AddIcon aria-hidden="true"/>
                        </Button>
                    </ListGroup.Item>
                    <NoteNavList
                        className="nav-list-ml"
                        notes={props.notes}
                        noteChildren={props.notes.filter(n => n.parentId === child.id)}
                        selectedNoteId={props.selectedNoteId}
                        onNoteSelectChange={props.onNoteSelectChange}
                        onNoteAdd={props.onNoteAdd}/>
                </>
            ))}
        </ListGroup>
    );
}
