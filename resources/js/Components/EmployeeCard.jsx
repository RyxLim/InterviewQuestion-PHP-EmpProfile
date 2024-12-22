import React from "react";

export default function EmployeeCard({ employee, handleEdit, handleDelete }) {
    return (
        <div className="col-md-4 mt-2">
            <div className="card fixed-height">
                <div className="card-header">
                    <b className="fs-5">{employee.name}</b>
                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-md-5'>
                            <b>MyKad</b>
                        </div>
                        <div className='col-md-7'>
                            : {employee.myKad}
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-5'>
                            <b>Employee ID</b>
                        </div>
                        <div className='col-md-7'>
                            : {employee.id}
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-5'>
                            <b>Gender</b>
                        </div>
                        <div className='col-md-7'>
                            : {employee.gender}
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-5'>
                            <b>Phone</b>
                        </div>
                        <div className='col-md-7'>
                            : {employee.phone}
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-5'>
                            <b>Email</b>
                        </div>
                        <div className='col-md-7'>
                            : {employee.email}
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-5'>
                            <b>Address</b>
                        </div>
                        <div className='col-md-7'>
                            : {employee.address}
                        </div>
                    </div>
                </div>
                <div className="card-footer text-center">
                    <button className="btn btn-primary me-2" onClick={() => handleEdit(employee)}>
                        Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(employee.id)}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}