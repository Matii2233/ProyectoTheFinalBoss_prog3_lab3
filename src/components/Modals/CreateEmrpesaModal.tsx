import { Col, Form, Row } from "react-bootstrap"


export const CreateEmrpesaModal = () => {
    return (
        <Form>
            <Row className="mb-3">
                <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                    required
                    type="text"
                    placeholder="First name"
                    defaultValue="Mark"
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
            </Row>
        </Form>
    )
}
