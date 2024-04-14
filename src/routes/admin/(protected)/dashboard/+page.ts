// export const prerender = false;
export const ssr = false;

import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { db } from '$lib/firebase';
import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore';
import { appointments, settingsStore } from '$lib/dataStore';
import type { AppointmentSchema } from '../../../../app';
import { get } from 'svelte/store';
// import { STATUS } from '$lib/constants';

export const load: PageLoad = async () => {
	// firebase query to get all documents from appointments collection
	const q = query(collection(db, 'appointments'));

	const querySnapshot = await getDocs(q);
	if (querySnapshot.empty) {
		error(404, 'Not found');
	}
	const data = querySnapshot.docs.map((doc) => {
		return {
			...doc.data(),
			id: doc.id
		} as AppointmentSchema;
	});
	appointments.set(data);

	//firebase query to get settings from the configs collections
	const commentList = get(settingsStore).commentList;
	if (commentList === null) {
		const settingsDocRef = doc(db, 'configs', 'settings');
		const settingsDoc = await getDoc(settingsDocRef);
		if (settingsDoc.exists()) {
			const settings = settingsDoc.data();
			settingsStore.update((prev) => ({
				...prev,
				commentList: settings.commentList ?? []
			}));
		} else {
			console.error('Settings document not found');
		}
	}
	return { data };
};
