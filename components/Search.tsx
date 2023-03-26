import {FormControl} from "react-bootstrap";
import {ListGroup} from "react-bootstrap";
import {
  SearchQueryResult,
  useSearchResultQuery,
} from "@/hooks/useSearchResultQuery";
import { useState } from "react";
import { NoteSearchPreview } from "@/pages/api/notes/search";

function HighlightedText(props: { text: string, textToHighlight: string }): JSX.Element {
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
            <HighlightedText text={note.title} textToHighlight={note.searchTerm}/>
            <br/>
            <HighlightedText text={note.content} textToHighlight={note.searchTerm}/>
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
    const navigateToNote = (noteId: number) => {
        props.onNoteSelectChange(noteId);
        props.onClose();
    };

  const [searchTerm, setSearchTerm] = useState("");
  const searchResult: SearchQueryResult = useSearchResultQuery(searchTerm);

    if (searchResult.error) {
        //TODO: error handling
    }

  return (
    <>
      <FormControl
        onChange={(evt) => {
          setSearchTerm(evt.target.value)}}
        placeholder="Search notes"
        autoFocus
      />
      <div className="m-5 text-muted">
        <SearchResultList
          notes={searchResult.notes}
          onNoteSelectChange={navigateToNote}
        />
      </div>
    </>
  );
}
