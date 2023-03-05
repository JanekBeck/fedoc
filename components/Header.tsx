import {Modal} from "react-bootstrap";
import {useState} from "react";
import SearchIcon from "bootstrap-icons/icons/search.svg"
import Search from "@/components/Search";

export default function Header(props: {
    onNoteSelectChange: (noteId: number) => void,
}) {
    const [showSearch, setShowSearch] = useState(false);

    const handleSearchClose = () => setShowSearch(false);

    const handleSearchShow = () => setShowSearch(true);

    return (
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
                    <Search onNoteSelectChange={props.onNoteSelectChange} onClosingModal={handleSearchClose}/>
                </Modal.Body>
            </Modal>
        </div>
    )
}

