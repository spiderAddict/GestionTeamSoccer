import React, { useEffect, useState } from 'react';
import { Payment } from '../types';
import { getPayments } from '../services/api';
import PaymentForm from '../components/Payments/PaymentForm';

const PaymentsPage: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);

    useEffect(() => {
        const fetchPayments = async () => {
            const data = await getPayments();
            setPayments(data);
        };
        fetchPayments();
    }, []);

    const handleEdit = (payment: Payment) => {
        setCurrentPayment(payment);
        setIsEditing(true);
    };

    const handleCloseForm = () => {
        setIsEditing(false);
        setCurrentPayment(null);
    };

    return (
        <div>
            <h1>Gestion des Paiements</h1>
            <button onClick={() => { setIsEditing(true); setCurrentPayment(null); }}>
                Ajouter un Paiement
            </button>
            <ul>
                {payments.map(payment => (
                    <li key={payment.id}>
                        {payment.playerPayer} a payé {payment.playerPaid} le {payment.paymentDate}
                        <button onClick={() => handleEdit(payment)}>Modifier</button>
                    </li>
                ))}
            </ul>
            {isEditing && (
                <PaymentForm 
                    payment={currentPayment} 
                    onClose={handleCloseForm} 
                />
            )}
        </div>
    );
};

export default PaymentsPage;