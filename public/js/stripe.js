import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_VEAoyMNl6476FFME4cPMc4lY00nVeeEgWm');

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
    showAlert('Success', 'Payment Successful');
  } catch (err) {
    showAlert('error', err);
  }
};
