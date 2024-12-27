import { Badge, Button, Col, Modal, Row, Table } from "react-bootstrap";
import styles from './ServerLogModal.module.css';
import { useEffect, useState } from "react";
import { ServerLogResponse } from "../../dtoTypes/ServerLogResponse";
import { selectPartyKey } from '../../slices/partySlice';
import { useSelector } from "react-redux";

interface props {
    show: boolean;
    handleClose: () => void;
}

const ServerLogModal = ({ show, handleClose }: props) => {
    const [data, setData] = useState<ServerLogResponse | null>(null);
    const partyKey = useSelector(selectPartyKey);

    useEffect(() => {
        if (show && !data) {
            // Fetch data when the component becomes visible
            fetchData().then(setData);
        }
    }, [show, data]);

    // Function to fetch data (replace with your actual fetch logic)
    const fetchData = async () => {
        const response = await fetch(`party/${partyKey}/ServerLog`);
        const data: ServerLogResponse = await response.json();
        return data;
    };

    const handleCancel = () => {
        setData(null);
        handleClose();
    }

    return (
        <>
            <Modal className={styles.serverLogModal} size="xl" show={show} backdrop="static">
                <Modal.Header closeButton onHide={handleCancel}>
                    <Modal.Title>Server Log</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <tr>
                            <th>Time</th>
                            <th>Level</th>
                            <th>Message</th>
                        </tr>
                        {data?.records.map((r) => <tr>
                            <td>{r.logTime}</td>
                            <td>{
                                r.logLevel === 'Information' ? <Badge bg="primary">{r.logLevel}</Badge> :
                                    r.logLevel === 'Warning' ? <Badge bg="warning">{r.logLevel}</Badge> :
                                        r.logLevel === 'Error' ? <Badge bg="danger">{r.logLevel}</Badge> :
                                            <Badge bg="secondary">{r.logLevel}</Badge>
                            }</td>
                            <td>{r.message}</td>
                        </tr>)}
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ServerLogModal;