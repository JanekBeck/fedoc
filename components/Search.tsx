import {FormControl} from "react-bootstrap";

export default function Search() {
    return (
        <>
            <FormControl
                placeholder="Search notes"
                autoFocus/>
            <div className="m-5 text-center text-muted">
                <p>No recent searches</p>
            </div>
        </>
    );
}