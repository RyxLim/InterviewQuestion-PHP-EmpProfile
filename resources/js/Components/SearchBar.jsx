import React from "react";

export default function SearchBar({ placeholder, handleSearch, handleAdd}) {
    return (
        <div className="d-flex justify-content-between">
            <input
                type="text"
                className="form-control me-2"
                placeholder={placeholder}
                onChange={handleSearch}
            />
            <button 
                className="btn btn-success"
                onClick={handleAdd}
            >
                <i className="fa fa-plus"></i>
            </button>
        </div>
    );
}