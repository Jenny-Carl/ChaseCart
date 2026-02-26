import React from 'react';
import { Link } from 'react-router-dom';
import Type from '../../components/Type';

const OrderSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white shadow-lg p-8 rounded max-w-xl text-center">
        <h1 className="text-2xl font-semibold mb-2">Payment accepted</h1>
        <p className="text-gray-600 mb-6">
          <Type texts={["Thank you for shopping with ChaseCart!"]} />
        </p>
        <Link to="/" className="bg-primary text-white px-4 py-2 rounded">Back to Home</Link>
      </div>
    </div>
  );
};

export default OrderSuccess;