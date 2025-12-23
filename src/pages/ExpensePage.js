import React from 'react';
import TransactionForm from '../components/TransactionForm';

const ExpensePage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <TransactionForm isIncome={false} />
        </div>
    );
};

export default ExpensePage;
