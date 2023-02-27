import {FormControl, Modal} from "react-bootstrap";
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
        <div className="home-sidebar flex-shrink-0 p-3 pt-0">
            <div className="sidebar-header d-flex gap-3 align-items-center py-3 mb-3 border-bottom">
                <span className="fs-5 fw-semibold">Fedoc</span>
                <button type="button" className="btn w-100 text-start sidebar-search gap-2 d-flex align-items-center"
                        onClick={handleSearchShow}>
                    <SearchIcon/>
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
            {props.rootNote != null && props.notes != null &&
                <NoteNavList
                    notes={props.notes}
                    noteChildren={[props.rootNote]}
                    selectedNoteId={props.selectedNoteId}
                    onNoteSelectChange={props.onNoteSelectChange}
                    onNoteAdd={props.onNoteAdd}/>
            }
        </div>
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
        <ul className={`list-unstyled fw-normal pb-1 ${props.className}`}>
            {props.noteChildren.map(child => (
                <li key={child.id}>
                    <span aria-label="button"
                          className={`btn nav-list-btn w-100 text-start text-nowrap d-flex gap-2
                                       ${props.selectedNoteId === child.id ? "sidebar-selected" : ""}`}
                          onClick={() => props.onNoteSelectChange(child.id)}>
                        {child.title}
                        <span aria-label="button"
                              className="btn btn-outline-dark nav-list-add border-0 py-0 px-1 align-items-center"
                              onClick={(event) => {
                                  event.stopPropagation();
                                  props.onNoteAdd(child.id);
                              }}>
                            <AddIcon/>
                        </span>
                    </span>
                    <NoteNavList
                        className="nav-list-ml"
                        notes={props.notes}
                        noteChildren={props.notes.filter(n => n.parentId === child.id)}
                        selectedNoteId={props.selectedNoteId}
                        onNoteSelectChange={props.onNoteSelectChange}
                        onNoteAdd={props.onNoteAdd}/>
                </li>
            ))}
        </ul>
    );
}
