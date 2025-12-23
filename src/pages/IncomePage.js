import React from 'react';
import TransactionForm from '../components/TransactionForm';

const IncomePage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <TransactionForm isIncome={true} />
        </div>
    );
};

export default IncomePage;
