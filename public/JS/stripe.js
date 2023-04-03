/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

var stripe = Stripe(
  'pk_test_51MqrwhSIvjP9MIFWd3uEaaZYI4oUFolPak3ylNCFBXedGjlUSyOVOoGlMSK9VEZQzBE3fbPApclZNh7vrmRvTS8u00tITjuJqk'
);

export const bookTour = async (tourId) => {
  try {
    //1 Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);
    //2 Create checkout from +charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
