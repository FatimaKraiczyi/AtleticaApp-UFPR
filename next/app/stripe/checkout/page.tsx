import {Metadata} from 'next';
import {StripeCheckout}  from '@/screens/stripe/checkout';

export default StripeCheckout

export const metadata: Metadata = {
	robots: 'noindex',
	title: 'Stripe Checkout'
};
