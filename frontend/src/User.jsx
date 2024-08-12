import React from 'react';
import UTable from './components/UTable';
import BPTable from './components/BPTable';
import SPTable from './components/SPTable';
import ImageTicker from './components/ImageTicker';
import './custom-styles.css';

const User = () => {
  return (
    <>
      <div className="columns is-max-wide-screen is-multiline">
        <div className="column is-half-desktop is-full-mobile">
          <SPTable />
        </div>
        <div className="column is-half-desktop is-full-mobile">
          <BPTable />
        </div>
      </div>
      <ImageTicker />
      <UTable />
    </>
  );
};

export default User;

