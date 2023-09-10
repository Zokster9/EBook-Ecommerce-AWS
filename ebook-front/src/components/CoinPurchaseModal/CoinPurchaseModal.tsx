import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CoinDiv from "../CoinDiv/CoinDiv";

type CoinPurchaseModalProps = {
  show: boolean;
  onCloseModal: () => void;
};

const CoinPurchaseModal = ({ show, onCloseModal }: CoinPurchaseModalProps) => {
  return (
    <Modal size="lg" show={show} onHide={onCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Purchase coins</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-around align-items-center">
        <CoinDiv cost={20} />
        <CoinDiv cost={50} />
        <CoinDiv cost={100} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CoinPurchaseModal;
