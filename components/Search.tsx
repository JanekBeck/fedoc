import { FormControl } from "react-bootstrap";
import useSWR from "swr";
import { Note } from "@prisma/client";
import { ListGroup } from "react-bootstrap";

export const fetcher = (input: RequestInfo, init: RequestInit) =>
  fetch(input, init).then((res) => res.json());

function createSearchResultList(
  notes: Omit<Note, "content">[],
  onNoteSelectChange: (noteId: number) => void
): JSX.Element | JSX.Element[] {
  if (notes?.length > 5) {
    notes = notes.slice(0, 5);
  }

  return (
    <ListGroup as="ul" variant="flush">
      {notes.map((note) => (
        <ListGroup.Item
          as="li"
          key={note.id.toString()}
          action
          className="d-flex gap-2 text-nowrap border-0 text-black"
          onClick={() => onNoteSelectChange(note.id.valueOf())}
        >
          {note?.title}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

//TODO: search Query will be implemented here or extracted to an external service
function useSearchResultQuery(searchTerm: String): Omit<Note, "content">[] {
  //TODO: use searchTerm for future search requests
  const { data: notes } = useSWR<Omit<Note, "content">[]>(
    "/api/notes",
    fetcher
  );
  return notes ?? [];
}

export default function Search(props: {
  onClosingModal: () => void;
  onNoteSelectChange: (noteId: number) => void;
}) {
  const navigateToNote = (noteId: number) => {
    props.onNoteSelectChange(noteId);
    props.onClosingModal();
  };

  const searchResult = useSearchResultQuery("");

  return (
    <>
      <FormControl placeholder="Search notes" autoFocus />
      <div className="m-5 text-center text-muted">
        {createSearchResultList(searchResult, navigateToNote)}
      </div>
    </>
  );
}
