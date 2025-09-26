import React from 'react';
import './style.css';

const PatientOverview = ({ patientData }) => {
  return (
    <div className="patient-overview">
      <div className="patient-header">
        <h2 className="patient-title">Patient Overview</h2>
      </div>
      <div className="patient-content">
        {patientData ? (
          <div className="patient-details">
            <div className="detail-item">
              <span className="detail-label">MRN Number:</span>
              <span className="detail-value">{patientData.mrnNo || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Admission Number:</span>
              <span className="detail-value">{patientData.admNo || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Doctor Code:</span>
              <span className="detail-value">{patientData.docCode || 'N/A'}</span>
            </div>
          </div>
        ) : (
          <div className="no-data">
            <p>No patient data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientOverview;
