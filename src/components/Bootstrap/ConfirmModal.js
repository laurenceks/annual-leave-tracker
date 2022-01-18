import {useContext, useEffect, useState} from "react";
import PropTypes from 'prop-types';
import {Button, Modal} from "react-bootstrap";
import {GlobalAppContext} from "../../App";
import {variantPairings} from "../common/styles";

const ConfirmModal = ({
                          show,
                          title,
                          bodyText,
                          handleYes,
                          handleNo,
                          yesText,
                          noText,
                          headerClass,
                          yesButtonVariant,
                          noButtonVariant,
                      }) => {

    const setModalOptions = useContext(GlobalAppContext)[0].setStateFunctions.confirmModal;
    const [lastExited, setLastExited] = useState(null);

    useEffect(() => {
        //reset options once not visible
        setModalOptions({})
    }, [lastExited, setModalOptions]);

    return (
        <Modal show={show}
               onHide={handleNo}
               onExited={() => setLastExited(Date.now())}
               backdrop="static"
               aria-labelledby="contained-modal-title-vcenter"
               centered>
            <Modal.Header className={headerClass}>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <div style={{whiteSpace: "pre-wrap"}}><Modal.Body>{bodyText}</Modal.Body></div>
            <Modal.Footer>
                <Button variant={noButtonVariant} onClick={(() => {
                    setModalOptions(prevState => {
                        return {...prevState, show: false}
                    })
                    handleNo && handleNo();
                })}>
                    {noText}
                </Button>
                <Button variant={yesButtonVariant} onClick={()=>{
                    setModalOptions(prevState => {
                        return {...prevState, show: false}
                    })
                    handleYes && handleYes();
                }}>
                    {yesText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

ConfirmModal.propTypes = {
    show: PropTypes.bool,
    handleYes: PropTypes.func,
    handleNo: PropTypes.func,
    bodyText: PropTypes.string,
    headerClass: PropTypes.string,
    noText: PropTypes.string,
    noButtonVariant: PropTypes.string,
    title: PropTypes.string,
    yesText: PropTypes.string,
    yesButtonVariant: PropTypes.string,
};

ConfirmModal.defaultProps = {
    show: false,
    headerClass: variantPairings.danger.header,
    handleNo: null,
    handleYes: (e) => {
        console.log("Yes clicked, but no handler passed")
    },
    bodyText: "Are you sure you wish to proceed?",
    noText: "Cancel",
    noButtonVariant: "secondary",
    title: "Are you sure?",
    yesText: "Yes",
    yesButtonVariant: "danger",
}

export default ConfirmModal;
