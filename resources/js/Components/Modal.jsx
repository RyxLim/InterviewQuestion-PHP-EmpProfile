import React from "react";

export default function Modal({ title, children, isOpen, handleSave, handleClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{title}</h5>
                    <button type="button" className="btn-close" onClick={handleClose}></button>
                </div>
                <div className="modal-body">{children}</div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleClose}>
                        Close
                    </button>
                    <button type="button" className="btn btn-primary" onClick={handleSave}>
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    </div>
    );
}