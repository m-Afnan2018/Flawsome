import React from 'react';
import style from './Product.module.css';

const AllDetails = ({ details }) => {
  return (
    <div className={style.detailsContainer}>
      <table className={style.detailsTable}>
        <thead>
          <tr>
            <th colSpan='2'>Information</th>
          </tr>
        </thead>
        <tbody>
          {details.map((detail, index) => (
            <tr key={index}>
              <td>{detail.heading}</td>
              <td>{detail.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllDetails;