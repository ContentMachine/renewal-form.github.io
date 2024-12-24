import React, { useState } from 'react';
import './VehicleForm.css'; // Ensure you have your custom CSS
import logo from '../assets/third-party-logo.png';


const VehicleForm = () => {
    const [formData, setFormData] = useState({
        number_plate: '',
        owner_name: '',
        owner_email: '',
        owner_phone: '',
        registration_date: '',
        vehicle_make: '',
        vehicle_model: '',
        vehicle_year: '',
        chassis_number: '',
        engine_number: '',
        insurance_type: 'Private',
        license_expiration_date: '',
        roadworthiness_expiration_date: '',
    });

    const [message, setMessage] = useState('');
    const [renewalChoice, setRenewalChoice] = useState(null);

    // Fetch vehicle data based on the number plate
    const checkExpirationDates = (data) => {
        const currentDate = new Date();
        const licenseExpiration = new Date(data.license_expiration_date);
        const roadworthinessExpiration = new Date(data.roadworthiness_expiration_date);
    
        if (currentDate >= licenseExpiration) {
            setMessage('Your vehicle license has expired. Would you like to renew it?');
        } else if (currentDate >= roadworthinessExpiration) {
            setMessage('Your roadworthiness certificate has expired. Would you like to renew it?');
        } else {
            setMessage('');
        }
    };
    
    const fetchVehicleData = async (numberPlate) => {
        try {
            const response = await fetch(
                `https://insurealltheway.ng/wp-json/vehicle/v1/fetch?number_plate=${numberPlate}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            const result = await response.json();
    
            if (response.ok) {
                // Merge fetched data into formData; keep blank fields empty
                setFormData((prevData) => ({
                    ...prevData,
                    ...result, // Use fetched data
                }));
                setMessage('');
            } else {
                // If no data found, reset the form and allow user to fill it
                setFormData((prevData) => ({
                    ...prevData,
                    number_plate: numberPlate, // Retain the number plate user entered
                }));
                setMessage('No data found. Please fill in the form.');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setMessage('Error fetching vehicle data.');
        }
    };    
    
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                'https://insurealltheway.ng/wp-json/vehicle/v1/submit',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                }
            );
    
            const result = await response.json();
    
            if (response.ok) {
                setMessage('Form submitted successfully!');
            } else {
                setMessage('Failed to submit form.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setMessage('Error submitting form.');
        }
    };   
    
    
    
    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    
        // Fetch vehicle data when the number_plate field is updated
        if (name === 'number_plate' && value.length > 3) {
            fetchVehicleData(value);
        }
    };
    

    // Handle renewal choice
    const handleRenewalChoice = (e) => {
        setRenewalChoice(e.target.value);
    };

    return (
        <div className="form-page">
            <div className="content-container">
                {}
               
                {}
                <div className="form-container">
                    <img src={logo} alt="Logo" className="logo" />
                    <h2>Vehicle Information Form</h2>
                    <form onSubmit={handleSubmit} className="vehicle-form">
                        <div>
                            <label>Number Plate:</label>
                            <input
                                type="text"
                                name="number_plate"
                                value={formData.number_plate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Owner Name:</label>
                            <input
                                type="text"
                                name="owner_name"
                                value={formData.owner_name || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Owner Email:</label>
                            <input
                                type="email"
                                name="owner_email"
                                value={formData.owner_email || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Owner Phone:</label>
                            <input
                                type="tel"
                                name="owner_phone"
                                value={formData.owner_phone || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Registration Date:</label>
                            <input
                                type="date"
                                name="registration_date"
                                value={formData.registration_date || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Vehicle Make:</label>
                            <input
                                type="text"
                                name="vehicle_make"
                                value={formData.vehicle_make || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Vehicle Model:</label>
                            <input
                                type="text"
                                name="vehicle_model"
                                value={formData.vehicle_model || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Vehicle Year:</label>
                            <input
                                type="number"
                                name="vehicle_year"
                                value={formData.vehicle_year || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Chassis Number:</label>
                            <input
                                type="text"
                                name="chassis_number"
                                value={formData.chassis_number || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Engine Number:</label>
                            <input
                                type="text"
                                name="engine_number"
                                value={formData.engine_number || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Insurance Type:</label>
                            <select
                                name="insurance_type"
                                value={formData.insurance_type || ''}
                                onChange={handleChange}
                            >
                                <option value="Private">Private</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Private-Commercial">Private-Commercial</option>
                            </select>
                        </div>

                        {}
                        <div>
                            <label>License Expiration Date:</label>
                            <input
                                type="date"
                                name="license_expiration_date"
                                value={formData.license_expiration_date || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Roadworthiness Expiration Date:</label>
                            <input
                                type="date"
                                name="roadworthiness_expiration_date"
                                value={formData.roadworthiness_expiration_date || ''}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Renewal Prompt */}
                        <div>
                            <label>Renewal:</label>
                            {message && (
                                <div className="renewal-prompt">
                                    <p>{message}</p>
                                    <div className="radio-buttons">
                                        <label>
                                            <input
                                                type="radio"
                                                name="renewalChoice"
                                                value="yes"
                                                onChange={handleRenewalChoice}
                                                checked={renewalChoice === 'yes'}
                                            />
                                            Yes
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="renewalChoice"
                                                value="no"
                                                onChange={handleRenewalChoice}
                                                checked={renewalChoice === 'no'}
                                            />
                                            No
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VehicleForm;
