import {Button, ListGroup} from "react-bootstrap";
import AddIcon from "bootstrap-icons/icons/plus-lg.svg";
import {Fragment} from "react";
import {NotePreview} from "@/interfaces/notePreview";

export function NoteNavList(props: {
    className?: string,
    notes: NotePreview[],
    noteChildren: NotePreview[],
    selectedNoteId: number | null,
    onNoteSelectChange: (noteId: number) => void,
    onNoteAdd: (parentId: number) => void
}) {
    return (
        <ListGroup as="ul" variant="flush" className={props.className}>
            {props.noteChildren.map(child => (
                <Fragment key={child.id}>
                    <ListGroup.Item as="li"
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
                </Fragment>
            ))}
        </ListGroup>
    );
}