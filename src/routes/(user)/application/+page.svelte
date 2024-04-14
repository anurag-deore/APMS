<script lang="ts">
	import { onMount } from 'svelte';
	import { db } from '$lib/firebase'; // Import Firestore module
	import { goto } from '$app/navigation';
	import {
		addDoc,
		collection,
		doc,
		serverTimestamp,
		setDoc
	} from 'firebase/firestore';
	import { generateTokenNumber } from '$lib/tokenGenerator';
	import type { AppointmentSchema } from '../../../app';
	import HomeIcon from '$lib/assets/HomeIcon.svelte';
	import { STATUS } from '$lib/constants';

	let formData: AppointmentSchema = {
		name: '',
		email: '',
		phone: '',
		address: '',
		purpose: '',
		status: STATUS.PENDING
	};

	let errors = {
		name: '',
		email: '',
		phone: '',
		address: '',
		purpose: ''
	};

	let isSubmitting = false;

	// Function to handle form submission
	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		isSubmitting = true;
		// Clear previous errors
		errors = {
			name: '',
			email: '',
			phone: '',
			address: '',
			purpose: ''
		};

		// Validate form fields
		if (!formData.name.trim()) {
			errors.name = 'Name is required';
		} else if (formData.name.trim().length < 3) {
			errors.name = 'Name must be at least 3 characters';
		}

		if (!formData.phone.trim()) {
			errors.phone = 'Phone is required';
		} else if (
			formData.phone.trim().length < 10 ||
			formData.phone.trim().length > 12
		) {
			errors.phone = 'Invalid phone number';
		}

		if (!formData.address.trim()) {
			errors.address = 'Address is required';
		}

		if (!formData.address.trim()) {
			errors.purpose =
				'Cannot be empty. Please provide a purpose for your visit.';
		}
		if (!formData.email.trim()) {
			errors.email = 'Email is required';
		} else if (!isValidEmail(formData.email)) {
			errors.email = 'Invalid email address';
		}

		// Check if any form field has an error
		if (Object.values(errors).some((error) => error)) {
			isSubmitting = false;
			return;
		}

		// If no validation errors, submit form
		if (!Object.values(errors).some((error) => error)) {
			try {
				await new Promise((resolve) => setTimeout(resolve, 2000));
				const tokenId = generateTokenNumber();
				// Add document to Firestore collection
				const docGen = await addDoc(collection(db, 'appointments'), {
					...formData,
					token: tokenId,
					timestamp: serverTimestamp()
				});
				// Redirect to token/[document-id] page on successful submission
				goto(`/token/${tokenId}`);

				// add fake delay
				alert('Form submitted successfully!');
			} catch (error) {
				console.error('Error submitting form:', error);
			} finally {
				isSubmitting = false;
			}
		}
	}

	// Function to validate email format
	function isValidEmail(email: string) {
		// Regular expression for email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}
</script>

<header class="w-full px-5 py-3 border-b">
	<a
		href="/"
		class="flex w-10 h-10 bg-gray-50 p-2 border border-gray-400 rounded-xl"
	>
		<HomeIcon />
	</a>
</header>
<div class="p-5">
	<h3 class="text-3xl text-left md:text-center font-semibold py-3">
		Application Form
	</h3>
	<form
		on:submit|preventDefault={handleSubmit}
		class="flex flex-col items-center w-full justify-center"
	>
		<fieldset
			disabled={isSubmitting}
			class="flex flex-col md:w-[50%] w-full justify-center gap-2 items-center"
		>
			<legend class="text-secondary text-left md:text-center"
				>Fill out the form for appointment</legend
			>
			<hr class="border-gray w-full" />
			<label class="form-control w-full font-normal">
				<div class="label justify-start gap-1">
					Name <span class="text-red-400">*</span>
				</div>
				<input
					type="text"
					bind:value={formData.name}
					id="name"
					class:input-error={errors.name}
					placeholder="Type here"
					class="input input-bordered rounded-xl w-full"
				/>
				{#if errors.name}
					<div class="label">
						<span class="label-text-alt text-red-500">{errors.name}</span>
					</div>
				{/if}
			</label>
			<label class="form-control w-full font-normal">
				<div class="label justify-start gap-1">
					Email <span class="text-red-400">*</span>
				</div>
				<input
					type="email"
					bind:value={formData.email}
					id="email"
					name="email"
					autocomplete="email"
					class:input-error={errors.email}
					placeholder="Type here"
					class="input input-bordered rounded-xl w-full"
				/>
				{#if errors.email}
					<div class="label">
						<span class="label-text-alt text-red-500">{errors.email}</span>
					</div>
				{/if}
			</label>
			<label class="form-control w-full font-normal">
				<div class="label justify-start gap-1">
					Phone <span class="text-red-400">*</span>
				</div>
				<input
					type="tel"
					bind:value={formData.phone}
					id="phone"
					name="phone"
					class:input-error={errors.phone}
					placeholder="Type here"
					class="input input-bordered rounded-xl w-full"
				/>
				{#if errors.phone}
					<div class="label">
						<span class="label-text-alt text-red-500">{errors.phone}</span>
					</div>
				{/if}
			</label>
			<label class="form-control w-full font-normal">
				<div class="label justify-start gap-1">
					Address <span class="text-red-400">*</span>
				</div>
				<input
					type="text"
					bind:value={formData.address}
					id="address"
					name="address"
					class:input-error={errors.address}
					placeholder="Type here"
					class="input input-bordered rounded-xl w-full"
				/>
				{#if errors.address}
					<div class="label">
						<span class="label-text-alt text-red-500">{errors.address}</span>
					</div>
				{/if}
			</label>
			<label class="form-control w-full font-normal">
				<div class="label justify-start gap-1">
					Purpose for visit<span class="text-red-400">*</span>
				</div>
				<textarea
					bind:value={formData.purpose}
					id="purpose"
					class:textarea-error={errors.purpose}
					placeholder="Type here"
					cols="10"
					class="textarea textarea-bordered rounded-xl w-full"
				></textarea>
				{#if errors.purpose}
					<div class="label">
						<span class="label-text-alt text-red-500">{errors.purpose}</span>
					</div>
				{/if}
			</label>
			<button
				class="btn btn-active rounded-xl btn-primary text-white font-normal text-lg w-full mt-3"
				type="submit"
			>
				{#if isSubmitting}
					<span class="loading loading-dots loading-sm"></span>
					<span>Submitting</span>
				{:else}
					<span>Submit</span>
				{/if}
			</button>
		</fieldset>
	</form>
</div>
