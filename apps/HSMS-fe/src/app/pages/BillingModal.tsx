import { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { message } from "antd";
import { UpdateBillingDto } from "../models/Billing.dto";
import { updateBilling } from "../services/Billing.service";

interface BillingModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  initialData?: { id?: number; billNumber?: string; totalAmount?: number; paidAmount?: number; paymentStatus?: string; paymentMethod?: string } | null;
}

export function BillingModal({ visible, onCancel, onSuccess, initialData }: BillingModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    billNumber: "",
    totalAmount: "",
    paidAmount: "",
    paymentStatus: "",
    paymentMethod: "",
  });

  useEffect(() => {
    if (visible) {
      setFormData({
        billNumber: initialData?.billNumber ?? "",
        totalAmount: initialData?.totalAmount?.toString() ?? "",
        paidAmount: (initialData?.paidAmount ?? initialData?.totalAmount)?.toString() ?? "",
        paymentStatus: initialData?.paymentStatus ?? "",
        paymentMethod: initialData?.paymentMethod ?? "",
      });
    }
  }, [visible, initialData]);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
      ...(field === "totalAmount" ? { paidAmount: value } : {}),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.billNumber || !formData.paidAmount || !formData.paymentStatus || !formData.paymentMethod) return;

    setSubmitting(true);
    try {
      if (initialData?.id) {
        const values: UpdateBillingDto = {
          billNumber: formData.billNumber,
          paidAmount: Number(formData.paidAmount),
          paymentStatus: formData.paymentStatus,
          paymentMethod: formData.paymentMethod,
        };
        await updateBilling(values);
        message.success("Billing record updated successfully.");
      } 
      onSuccess();
      onCancel();
    } catch {
      message.error("Failed to save billing record.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={initialData?.id ? "Edit Billing Record" : "Create Billing Record"}
      show={visible}
      onCancel={onCancel}
      centered
      fullscreen="sm-down"
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{initialData?.id ? "Edit Billing Record" : "Create Billing Record"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="billing-bill-number">
            <Form.Label>Bill Number</Form.Label>
            <Form.Control required value={formData.billNumber} onChange={(event) => updateField("billNumber", event.target.value)} placeholder="Enter bill number" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="billing-total-amount">
            <Form.Label>Total Amount</Form.Label>
            <Form.Control type="number" min="0" step="0.01" value={formData.totalAmount} onChange={(event) => updateField("totalAmount", event.target.value)} placeholder="0.00" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="billing-paid-amount">
            <Form.Label>Paid Amount</Form.Label>
            <Form.Control required type="number" min="0" step="0.01" value={formData.paidAmount} onChange={(event) => updateField("paidAmount", event.target.value)} placeholder="0.00" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="billing-payment-status">
            <Form.Label>Payment Status</Form.Label>
            <Form.Select required value={formData.paymentStatus} onChange={(event) => updateField("paymentStatus", event.target.value)}>
              <option value="">Select status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="billing-payment-method">
            <Form.Label>Payment Method</Form.Label>
            <Form.Select required value={formData.paymentMethod} onChange={(event) => updateField("paymentMethod", event.target.value)}>
              <option value="">Select method</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="UPI">UPI</option>
              <option value="Insurance">Insurance</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting && <Spinner animation="border" size="sm" className="me-2" />}
            {initialData?.id ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}