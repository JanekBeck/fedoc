import { FormControl } from "react-bootstrap";
import useSWR from "swr";
import { Note } from "@prisma/client";
import { ListGroup } from "react-bootstrap";

export const fetcher = (input: RequestInfo, init: RequestInit) =>
  fetch(input, init).then((res) => res.json());

function SearchResultList(props: {
  notes: Omit<Note, "content">[];
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

interface SearchQueryResult {
  notes: Omit<Note, "content">[];
  error: Error | undefined;
  isLoading: boolean;
}

//TODO: implement proper search query backend
function useSearchResultQuery(searchTerm: string): SearchQueryResult {
  const { data, error, isLoading } = useSWR<Omit<Note, "content">[]>(
    "/api/notes",
    fetcher
  );
  return { notes: data?.slice(0, 5) ?? [], error: error, isLoading: isLoading };
}

export default function Search(props: {
  onClose: () => void;
  onNoteSelectChange: (noteId: number) => void;
}) {
  const navigateToNote = (noteId: number) => {
    props.onNoteSelectChange(noteId);
    props.onClose();
  };

  const searchResult = useSearchResultQuery("");

  if (searchResult.error) {
    //TODO: error handling
  }

  return (
    <>
      <FormControl placeholder="Search notes" autoFocus />
      <div className="m-5 text-center text-muted">
        <SearchResultList
          notes={searchResult.notes}
          onNoteSelectChange={navigateToNote}
        />
      </div>
    </>
  );
}
