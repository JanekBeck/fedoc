import { FormControl, ListGroup } from "react-bootstrap";
import {useSearchResultQuery} from "@/hooks/useSearchResultQuery";
import { useState } from "react";
import { NoteSearchPreview } from "@/interfaces/noteSearchPreview";

function HighlightedText(props: {
  text: string;
  textToHighlight: string;
}): JSX.Element {
  const textArray = props.text.split(props.textToHighlight);
  return (
    <span>
      {textArray.map((item, index) => (
        <p className="d-inline" key={index}>
          {item}
          {index !== textArray.length - 1 && (
            <mark>{props.textToHighlight}</mark>
          )}
        </p>
      ))}
    </span>
  );
}

function SearchResultList(props: {
  notes: NoteSearchPreview[];
  onNoteSelectChange: (noteId: number) => void;
}): JSX.Element {
  return (
    <ListGroup as="ul" variant="flush">
      {props.notes.map((note) => (
        <ListGroup.Item
          as="li"
          key={note.id}
          action
          className="d-flex gap-2 border-0 text-black"
          onClick={() => props.onNoteSelectChange(note.id)}
        >
          <div>
            <HighlightedText
              text={note.title}
              textToHighlight={note.searchTerm}
            />
            <br />
            <HighlightedText
              text={note.content}
              textToHighlight={note.searchTerm}
            />
          </div>
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

    const [searchTerm, setSearchTerm] = useState("");
    const {notes, error} = useSearchResultQuery(searchTerm);

    if (error) {
        //TODO: error handling
    }

    return (
        <>
            <FormControl placeholder="Search notes" autoFocus
                         value={searchTerm}
                         onChange={(evt) => setSearchTerm(evt.target.value)}/>
            <div className="m-5 text-muted">
                <SearchResultList
                    notes={notes}
                    onNoteSelectChange={handleNoteSelectChange}/>
            </div>
        </>
    );
}
