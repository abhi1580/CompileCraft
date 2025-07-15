import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function DeleteConfirmDialog({ open, onConfirm, onCancel, message = 'Are you sure you want to delete this item?' }) {
  return (
    <Modal show={open} onHide={onCancel} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-danger fw-bold mb-2">{message}</div>
        <div className="text-muted">This action cannot be undone.</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
} 