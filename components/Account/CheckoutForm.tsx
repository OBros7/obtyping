import React, { useContext } from 'react';
import { GlobalContext } from 'context/GlobalContext'

const CheckoutForm = () => {
    const { userID } = useContext(GlobalContext)
    const handleClick = async (event: React.MouseEvent) => {
        event.preventDefault();


        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userID }),
            });

            const result = await response.json();
            if (response.ok) {
                if (result.url) {
                    window.location.href = result.url;
                } else {
                    console.error('Error creating Checkout Session 1:', result.error);
                }
            } else {
                console.error('Error creating Checkout Session 2:', result.error);
            }
        } catch (error) {
            console.error('Error creating Checkout Session 3:', error);
        }
    };

    return (
        <button onClick={handleClick}>
            Pay with Stripe Checkout
        </button>
    );
};

export default CheckoutForm;
