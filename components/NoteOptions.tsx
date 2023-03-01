import {Button, Dropdown, Modal} from "react-bootstrap";
import ThreeDotsVerticalIcon from "bootstrap-icons/icons/three-dots-vertical.svg";
import {useState} from "react";

export default function NoteOptions(props: {
    disabled: boolean,
    disabledDelete: boolean,
    noteTitle: string,
    onDelete: () => void,
}) {
    const [showOptions, setShowOptions] = useState(false);

    const handleOptionsClose = () => setShowOptions(false);

    const handleOptionsShow = () => setShowOptions(true);

    const handleDelete = () => {
        handleOptionsClose();
        props.onDelete();
    }

    return (
        <>
            <Dropdown>
                <Dropdown.Toggle variant="outline-dark"
                                 className="border-0"
                                 aria-label="Options"
                                 disabled={props.disabled}
                                 id="options-dropdown">
                    <ThreeDotsVerticalIcon width={20} height={20} aria-hidden="true"/>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item as="button"
                                   onClick={handleOptionsShow}
                                   disabled={props.disabledDelete}>
                        Delete
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Modal show={showOptions} onHide={handleOptionsClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete note</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Do you really want to delete <span className="fw-bold">{props.noteTitle}</span>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleOptionsClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
