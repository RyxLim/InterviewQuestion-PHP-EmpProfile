import React from "react";

export default function EmployeeList({ employees, handleEdit, handleDelete }) {
    return (
        <table className="table table-bordered table-hover mt-2">
            <thead className='table-dark'>
                <tr>
                    <th>Emp ID</th>
                    <th>Name</th>
                    <th>MyKad / Passport</th>
                    <th>Gender</th>
                    <th>Marital Status</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th className="long-cell">Address</th>
                    <th>Date of Birth</th>
                    <th>Nationality</th>
                    <th>Hire Date</th>
                    <th>Department</th>
                    <th className="text-center">Action</th>
                </tr>
            </thead>
            <tbody>
                {employees.map(employee => (
                    <tr key={employee.id}>
                        <td>{employee.id}</td>
                        <td>{employee.name}</td>
                        <td>{employee.myKad}</td>
                        <td>{employee.gender}</td>
                        <td>{employee.maritalStatus}</td>
                        <td>{employee.phone}</td>
                        <td>{employee.email}</td>
                        <td className="text-break">{employee.address}</td>
                        <td>{employee.dateOfBirth}</td>
                        <td>{employee.nationality}</td>
                        <td>{employee.hireDate}</td>
                        <td>{employee.department}</td>
                        <td className='text-center'>
                            <button className="btn btn-sm btn-primary me-1" onClick={() => handleEdit(employee)}>Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(employee.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}