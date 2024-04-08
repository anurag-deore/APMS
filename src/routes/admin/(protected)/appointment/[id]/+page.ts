export const prerender = false;
export const ssr = false;

import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '$lib/firebase';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { get } from 'svelte/store';
import type { AppointmentSchema } from '../../../../../app';
import { appointments } from '$lib/dataStore';

export const load: PageLoad = async ({ params }) => {
	const { id } = params;
	const docId = id;

	// return {
	// 	timestamp: {
	// 		seconds: 1710961178,
	// 		nanoseconds: 108000000
	// 	},
	// 	token: 'WT8zo',
	// 	purpose:
	// 		'Lorem ipsum, dolor sit amet cons ec t etur adipisicing elit. Debitis numquam expedita laboriosam aperiam? Maiores reprehenderit quia dolore eos nesciunt? Numquam suscipit eos non aperiam omnis, consequatur adipisci magni mollitia sed.',
	// 	name: 'Anurag deore',
	// 	status: 'PENDING',
	// 	email: 'anuragravindradeore125@gmail.com',
	// 	address: 'Thane',
	// 	phone: '7506656227',
	// 	id: 'MBBMPtFHNlNDMYiv39LS'
	// };

	const appointmentStoreList = get(appointments);
	if (appointmentStoreList) {
		const d = (get(appointments) as AppointmentSchema[]).find(
			(doc) => doc.id === docId
		);
		if (d) {
			return { data: d };
		}
	}

	const q = query(
		collection(db, 'appointments'),
		where('token', '==', params.id)
	);
	const docSnap = await getDocs(q);
	if (!docSnap.empty) {
		const docres = docSnap.docs[0];
		const data = docres.data() as AppointmentSchema;
		return {
			...data,
			id: docres.id
		};
	} else {
		error(404, 'No data found for this token');
	}
};
