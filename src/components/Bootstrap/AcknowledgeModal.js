import PropTypes from 'prop-types';
import {Button, Modal} from "react-bootstrap";

const AcknowledgeModal = ({show, title, bodyText, handleClick, buttonText, headerClass, buttonVariant, breakWords}) => {
    return (
        <Modal show={show}
               onHide={handleClick}
               backdrop="static"
               aria-labelledby="contained-modal-title-vcenter"
               centered
        >
            <Modal.Header className={headerClass}>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <div style={{whiteSpace: breakWords ? "pre-line" : "pre-wrap", wordBreak: breakWords ? "break-word" : ""}}><Modal.Body>{bodyText}</Modal.Body></div>
            <Modal.Footer>
                <Button variant={buttonVariant} onClick={handleClick}>
                    {buttonText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

AcknowledgeModal.propTypes = {
    show: PropTypes.bool,
    breakWords: PropTypes.bool,
    handleClick: PropTypes.func,
    buttonText: PropTypes.string,
    buttonVariant: PropTypes.string,
    bodyText: PropTypes.string,
    headerClass: PropTypes.string,
    title: PropTypes.string
};

AcknowledgeModal.defaultProps = {
    show: false,
    breakWords: false,
    handleClick: (e) => {
        console.log("Button clicked, but no handler passed")
    },
    buttonText: "OK",
    title: "Error",
    bodyText: "An unknown error occurred",
    headClass: null,
    buttonVariant: "primary"
}

export default AcknowledgeModal;
