import {FormControl} from "react-bootstrap";
import {ListGroup} from "react-bootstrap";
import {useSearchResultQuery} from "@/hooks/useSearchResultQuery";
import {NotePreview} from "@/interfaces/notePreview";

function SearchResultList(props: {
    notes: NotePreview[];
    onNoteSelectChange: (noteId: number) => void;
}): JSX.Element {
    return (
        <ListGroup as="ul" variant="flush">
            {props.notes.map((note) => (
                <ListGroup.Item
                    as="li"
                    key={note.id}
                    action
                    className="d-flex gap-2 text-nowrap border-0 text-black"
                    onClick={() => props.onNoteSelectChange(note.id)}
                >
                    {note.title}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
}

export default function Search(props: {
    onClose: () => void;
    onNoteSelectChange: (noteId: number) => void;
}) {
    const handleNoteSelectChange = (noteId: number) => {
        props.onNoteSelectChange(noteId);
        props.onClose();
    };

    const {notes, error} = useSearchResultQuery("");

    if (error) {
        //TODO: error handling
    }

    return (
        <>
            <FormControl placeholder="Search notes" autoFocus/>
            <div className="m-5 text-center text-muted">
                <SearchResultList
                    notes={notes}
                    onNoteSelectChange={handleNoteSelectChange}/>
            </div>
        </>
    );
}
