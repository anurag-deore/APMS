export const prerender = false;
export const ssr = false;

import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { db } from '$lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { AppointmentSchema } from '../../../../app';
// import { STATUS } from '$lib/constants';

export const load: PageLoad = async ({ params, depends }) => {
	depends('app:loadToken');

	const q = query(
		collection(db, 'appointments'),
		where('token', '==', params.id)
	); // Build a query
	const querySnapshot = await getDocs(q);

	if (querySnapshot.empty) {
		error(404, 'Not found');
	}

	const docres = querySnapshot.docs[0];
	const data = docres.data() as AppointmentSchema;
	const finalData = {
		...data
	};
	return {
		comment: finalData.comment,
		Name: finalData.name,
		Phone: finalData.phone,
		Email: finalData.email,
		status: finalData.status,
		Address: finalData.address,
		Token: finalData.token,
		Purpose: finalData.purpose
	};
	// } else {
	// docSnap.data() will be undefined in this case
	error(404, 'Not found');
	// }
};
