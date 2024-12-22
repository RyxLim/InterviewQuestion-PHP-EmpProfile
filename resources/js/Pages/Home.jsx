import axios from "axios";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import MainLayout from "../Layouts/MainLayout";
import SearchBar from "../Components/SearchBar";
import EmployeeList from "../Components/EmployeeList";
import Modal from "../Components/Modal";

export default function Home() {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        myKad: "",
        gender: "",
        maritalStatus: "",
        phone: "",
        email: "",
        address: "",
        dateOfBirth: "",
        nationality: "",
        hireDate: "",
        department: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Fetch employees from the API
        const fetchEmployees = async () => {
            try {
                const response = await axios.get("/emp/api/employees");
                setEmployees(response.data.data);
                setFilteredEmployees(response.data.data);
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error.response.data.message || "An unexpected error occurred during fetching employees.",
                    confirmButtonText: "OK",
                });
            }
        };

        fetchEmployees();
    }, []);

    useEffect(() => {
        const filtereed = employees.filter((employee) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                employee.name.toLowerCase().includes(searchLower) ||
                employee.myKad.toLowerCase().includes(searchLower) ||
                employee.id.toString().toLowerCase().includes(searchLower)
            );
        });

        setFilteredEmployees(filtereed);
    }, [searchQuery, employees]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleEdit = (employee) => {
        setIsEditing(true);
        setCurrentEmployeeId(employee.id);
        setFormData(employee);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            const confirm = await Swal.fire({
                icon: "warning",
                title: "Are you sure?",
                text: "Do you want to delete this employee?",
                showCancelButton: true,
                confirmButtonText: "Yes",
                cancelButtonText: "No",
            });
            
            if (confirm.isConfirmed) {
                await axios.delete(`/emp/api/employees/${id}`);

                // Retrieve new list of employees
                try {
                    const response = await axios.get("/emp/api/employees");
                    setEmployees(response.data.data);
                    setFilteredEmployees(response.data.data);

                    Swal.fire({
                        icon: "success",
                        title: "Employee Deleted!",
                        text: "Employee has been deleted successfully.",
                        confirmButtonText: "OK",
                    });
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "An unexpected error occurred during refreshing employee list.",
                        confirmButtonText: "OK",
                    });
                }
            }
        } catch (error) {
            if (error.response) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error.response.data.message || "Something went wrong!",
                    confirmButtonText: "OK",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "An unexpected error occurred while deleting the employee.",
                    confirmButtonText: "OK",
                });
            }
        }
    };

    const handleAdd = () => {
        setIsEditing(false);
        resetFormData();
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setErrors({});
        resetFormData();
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        const newErrors = {};

        // Client side validation
        if (!formData.name.trim()) newErrors.name = "Name is required.";
        if (!formData.myKad.trim())
            newErrors.myKad = "MyKad/Passport is required.";
        if (!formData.gender) newErrors.gender = "Gender is required.";
        if (!formData.maritalStatus)
            newErrors.maritalStatus = "Marital status is required.";
        if (!formData.phone.trim())
            newErrors.phone = "Phone number is required.";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid.";
        }
        if (!formData.address.trim())
            newErrors.address = "Address is required.";
        if (!formData.dateOfBirth)
            newErrors.dateOfBirth = "Date of birth is required.";
        if (!formData.nationality.trim())
            newErrors.nationality = "Nationality is required.";
        if (!formData.hireDate) newErrors.hireDate = "Hire date is required.";
        if (!formData.department)
            newErrors.department = "Department is required.";

        // Check if there are errors
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Clear the errors if there are no errors
        setErrors({});

        try {
            if (isEditing) {
                await axios.put(`/emp/api/employees/${currentEmployeeId}`, formData, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                Swal.fire({
                    icon: "success",
                    title: "Employee Updated!",
                    text: "Employee details has been updated successfully.",
                    confirmButtonText: "OK",
                });
            } else {
                await axios.post("/emp/api/employees", formData, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                Swal.fire({
                    icon: "success",
                    title: "Employee Added!",
                    text: "Employee has been added successfully.",
                    confirmButtonText: "OK",
                });
            }

            resetFormData();
            handleModalClose();

            // Retrieve new list of employees
            try {
                const response = await axios.get("/emp/api/employees");
                setEmployees(response.data.data);
                setFilteredEmployees(response.data.data);
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "An unexpected error occurred during refreshing employee list.",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            if (error.response) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text:
                        error.response.data.message || "Something went wrong!",
                    confirmButtonText: "OK",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "An unexpected error occurred.",
                    confirmButtonText: "OK",
                });
            }
        }
    };

    const resetFormData = () => {
        setFormData({
            name: "",
            myKad: "",
            gender: "",
            maritalStatus: "",
            phone: "",
            email: "",
            address: "",
            dateOfBirth: "",
            nationality: "",
            hireDate: "",
            department: "",
        });
    };

    return (
        <>
            <div className={isModalOpen ? "blur" : ""}>
                <MainLayout>
                    <h1 className="text-center mt-5">Employee List</h1>
                    <SearchBar
                        placeholder="Search by Name / MyKad / Passport / Emp ID"
                        handleSearch={handleSearch}
                        handleAdd={handleAdd}
                    />
                    {/* Pass employees to EmployeeList */}
                    <EmployeeList
                        employees={filteredEmployees}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                    />
                </MainLayout>
            </div>
            <Modal
                title={isEditing ? "Edit Employee" : "Add Employee"}
                isOpen={isModalOpen}
                handleSave={handleSave}
                handleClose={handleModalClose}
            >
                <form>
                    {/* Row 1: Name & MyKad/Passport No. */}
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Name</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="fa fa-user"></i>
                                </span>
                                <input
                                    type="text"
                                    name="name"
                                    className={`form-control ${
                                        errors.name ? "is-invalid" : ""
                                    }`}
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter full name"
                                    required
                                />
                                {errors.name && (
                                    <div className="invalid-feedback">
                                        {errors.name}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                MyKad / Passport No.
                            </label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="fa fa-id-card"></i>
                                </span>
                                <input
                                    type="text"
                                    name="myKad"
                                    className={`form-control ${
                                        errors.myKad ? "is-invalid" : ""
                                    }`}
                                    value={formData.myKad}
                                    onChange={handleInputChange}
                                    placeholder="Enter MyKad or Passport No."
                                    required
                                />
                                {errors.myKad && (
                                    <div className="invalid-feedback">
                                        {errors.myKad}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Gender & Marital Status */}
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Gender</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="fa fa-venus-mars"></i>
                                </span>
                                <select
                                    name="gender"
                                    className={`form-select ${
                                        errors.gender ? "is-invalid" : ""
                                    }`}
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.gender && (
                                    <div className="invalid-feedback">
                                        {errors.gender}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Marital Status</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="fa fa-heart"></i>
                                </span>
                                <select
                                    name="maritalStatus"
                                    className={`form-select ${
                                        errors.maritalStatus ? "is-invalid" : ""
                                    }`}
                                    value={formData.maritalStatus}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select status</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                                {errors.maritalStatus && (
                                    <div className="invalid-feedback">
                                        {errors.maritalStatus}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Row 3: Phone No. & Email */}
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Phone No.</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="fa fa-phone"></i>
                                </span>
                                <input
                                    type="tel"
                                    name="phone"
                                    className={`form-control ${
                                        errors.phone ? "is-invalid" : ""
                                    }`}
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Enter phone number"
                                    required
                                />
                                {errors.phone && (
                                    <div className="invalid-feedback">
                                        {errors.phone}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Email</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="fa fa-envelope"></i>
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    className={`form-control ${
                                        errors.email ? "is-invalid" : ""
                                    }`}
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter email address"
                                    required
                                />
                                {errors.email && (
                                    <div className="invalid-feedback">
                                        {errors.email}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="mb-3">
                        <label className="form-label">Address</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fa fa-map-marker"></i>
                            </span>
                            <textarea
                                name="address"
                                className={`form-control ${
                                    errors.address ? "is-invalid" : ""
                                }`}
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Enter address"
                                rows="2"
                                required
                            ></textarea>
                            {errors.address && (
                                <div className="invalid-feedback">
                                    {errors.address}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Row 4: Hired Date & Department */}
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Date of Birth</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="fa fa-calendar"></i>
                                </span>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    className={`form-control ${
                                        errors.dateOfBirth ? "is-invalid" : ""
                                    }`}
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.dateOfBirth && (
                                    <div className="invalid-feedback">
                                        {errors.dateOfBirth}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Nationality</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="fa fa-flag"></i>
                                </span>
                                <input
                                    type="text"
                                    name="nationality"
                                    className={`form-control ${
                                        errors.nationality ? "is-invalid" : ""
                                    }`}
                                    value={formData.nationality}
                                    onChange={handleInputChange}
                                    placeholder="Enter nationality"
                                    required
                                />
                                {errors.nationality && (
                                    <div className="invalid-feedback">
                                        {errors.nationality}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Hired Date</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="fa fa-briefcase"></i>
                                </span>
                                <input
                                    type="date"
                                    name="hireDate"
                                    className={`form-control ${
                                        errors.hireDate ? "is-invalid" : ""
                                    }`}
                                    value={formData.hireDate}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.hireDate && (
                                    <div className="invalid-feedback">
                                        {errors.hireDate}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                        <label className="form-label">Department</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fa fa-building"></i>
                            </span>
                            <select name="department"
                                    className={`form-select ${
                                        errors.department ? "is-invalid" : ""
                                    }`}
                                    value={formData.department}
                                    onChange={handleInputChange}
                            >
                                <option value="">Select department</option>
                                <option value="HR">Human Resources</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Marketing">Marketing</option>
                            </select>
                            {errors.gender && (
                                <div className="invalid-feedback">
                                    {errors.department}
                                </div>
                            )}
                        </div>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    );
}
