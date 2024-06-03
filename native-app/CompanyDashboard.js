import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Headers from './Headers';
import axios from 'axios';

const CompanyDashboard = ({ authenticated }) => {
  const navigate = useNavigate();
  const { dbName } = useParams();
  const location = useLocation();
  const [company, setCompany] = useState(location.state?.company);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Access token not found.');
          return;
        }

        const compName = dbName;
        if (!compName) {
          console.error('Company name not found in URL params.');
          return;
        }

        const response = await axios.get(
          `http://127.0.0.1:6363/api/${compName}/company-dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Company data:', response.data);
        setCompany(response.data.companynews); // Assuming companynews contains the news data
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    if (!company) {
      fetchCompanyData();
    }
  }, [dbName, company]);

  return (
    <div style={containerStyle}>
      <div style={headerContainerStyle}>
        <Headers authenticated={authenticated} />
      </div>
      <div style={contentContainerStyle}>
        <div style={cardContainerStyle}>
          <h1 style={headingStyle}>Dashboard for: {dbName}</h1>
          <div style={cardContentStyle}>
            <h3>Company News:</h3>
            {company ? (
              <ul>
                {company.map((newsItem, index) => (
                  <li key={index}>
                    <strong>{newsItem.News}</strong>: {newsItem.date}
                  </li> 
                ))}
              </ul>
            ) : (
              <p>Loading company data...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#FEFEFE',
  marginLeft:'10px'
};

const headerContainerStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  zIndex: 100,
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const contentContainerStyle = {
  marginTop: '60px', 
  overflowY: 'auto',
  flex: 1,
  padding: '20px',
};

const cardContainerStyle = {
  backgroundColor: '#F5A6AD',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  padding: '20px',
  margin: '20px',
  width: '250px',
  height: '300px',
  marginTop: '100px',
  overflow: 'auto',
};

const cardContentStyle = {
  // Add your styles here
};

const headingStyle = {
  fontSize: '24px',
};

export default CompanyDashboard;
