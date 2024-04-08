<script lang="ts">
	import { onMount } from 'svelte';

	import { getAuth, updatePassword, type AuthError } from 'firebase/auth';
	import IconButton from '$lib/components/IconButton.svelte';
	import DeleteIcon from '$lib/assets/DeleteIcon.svelte';
	import EditIcon from '$lib/assets/EditIcon.svelte';
	import AddIcon from '$lib/assets/AddIcon.svelte';
	import { get } from 'svelte/store';
	import { settingsStore } from '$lib/dataStore';
	import { doc, getDoc, updateDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import type { FirebaseError } from 'firebase/app';
	import { firebaseAuthErrorMap } from '$lib/constants';
	import CheckIcon from '$lib/assets/CheckIcon.svelte';
	import CancelIcon from '$lib/assets/CancelIcon.svelte';
	import Button from '$lib/components/Button.svelte';
	import ExportIcon from '$lib/assets/ExportIcon.svelte';

	let newCommentTemplate = '';
	let newCommentTemplateError = '';

	let isSaving = false;

	let firebasePasswordError = '';
	let comments: string[] = [];

	onMount(async () => {
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
				comments = settings.commentList;
			} else {
				console.error('Settings document not found');
			}
		} else {
			comments = commentList;
		}
	});

	async function changePassword(password: string) {
		const auth = getAuth();
		const user = auth.currentUser;
		if (!user) {
			throw new Error('No user logged in');
		}
		try {
			await updatePassword(user, password);
			alert('Password changed successfully');
			return true;
		} catch (error) {
			const e = error as FirebaseError;
			firebasePasswordError = firebaseAuthErrorMap[e.code] ?? e.message;
			return false;
		}
	}

	let changePasswordFormFields = {
		new_password: '',
		confirm_password: ''
	};

	let changePasswordFormErrors = {
		new_password: '',
		confirm_password: ''
	};

	let handleSubmit = () => {
		// reset errors
		changePasswordFormErrors = {
			new_password: '',
			confirm_password: ''
		};

		// perform validation
		let isValid = true;
		if (changePasswordFormFields.new_password.length === 0) {
			changePasswordFormErrors.new_password = 'New password is required';
			isValid = false;
		}
		if (changePasswordFormFields.confirm_password.length === 0) {
			changePasswordFormErrors.confirm_password =
				'Confirm password is required';
			isValid = false;
		}
		if (
			changePasswordFormFields.new_password !==
			changePasswordFormFields.confirm_password
		) {
			changePasswordFormErrors.confirm_password = 'Passwords do not match';
			isValid = false;
		}

		if (isValid) {
			changePassword(changePasswordFormFields.new_password);
		}
	};
	function editComment(index: number) {
		newCommentTemplate = comments[index];
		const inputElement = document.querySelector(
			'#new-comment'
		) as HTMLInputElement;
		comments = comments.filter((_, i) => i !== index);
		inputElement.focus();
	}

	function onCancelEdit() {
		if (newCommentTemplate.length === 0) return;
		comments = [...comments, newCommentTemplate];
		newCommentTemplate = '';
		newCommentTemplateError = '';
		return;
	}
	function onAddClick() {
		if (newCommentTemplate.length === 0) {
			newCommentTemplateError = 'Cannot be empty';
			return;
		}
		comments = [...comments, newCommentTemplate];
		newCommentTemplate = '';
		newCommentTemplateError = '';
	}

	function onDeleteClick(index: number) {
		comments = comments.filter((_, i) => i !== index);
	}

	function onSaveClick() {
		isSaving = true;
		if (comments === get(settingsStore).commentList) {
			isSaving = false;
			return;
		}
		try {
			updateDoc(doc(db, 'configs', 'settings'), {
				commentList: comments
			}).then(() => {
				newCommentTemplate = '';
				newCommentTemplateError = '';
				settingsStore.update((prev) => ({
					...prev,
					commentList: comments
				}));
				isSaving = false;
			});
		} catch (error) {
			newCommentTemplateError = 'Could not save';
			isSaving = false;
		}
	}
</script>

<div class=" flex flex-col grow gap-5">
	<!-- <h2 class="text-lg font-semibold px-5 pt-5">Change password</h2>
	{#if firebasePasswordError}
		<div class="bg-red-100 text-red-500 p-3 mx-5 rounded-lg">
			{firebasePasswordError}
		</div>
	{/if}
	<form
		class="flex flex-col gap-3 px-5"
		on:submit|preventDefault={handleSubmit}
	>
		<input hidden type="text" autocomplete="username" value="" />
		<label class="form-control w-full font-normal">
			<div class="label justify-start gap-1">
				New Password <span class="text-red-400">*</span>
			</div>
			<input
				type="password"
				autocomplete="new-password"
				name="new_password"
				id="new_password"
				class:input-error={changePasswordFormErrors.new_password}
				bind:value={changePasswordFormFields.new_password}
				placeholder="Type here"
				class="input input-bordered rounded-xl w-full"
			/>
			{#if changePasswordFormErrors.new_password}
				<div class="label">
					<span class="label-text-alt text-red-500">
						{changePasswordFormErrors.new_password}
					</span>
				</div>
			{/if}
		</label>
		<label class="form-control w-full font-normal">
			<div class="label justify-start gap-1">
				Confirm Password <span class="text-red-400">*</span>
			</div>
			<input
				type="password"
				autocomplete="new-password"
				name="confirm_password"
				id="confirm_password"
				class:input-error={changePasswordFormErrors.confirm_password}
				bind:value={changePasswordFormFields.confirm_password}
				placeholder="Type here"
				class="input input-bordered rounded-xl w-full"
			/>
			{#if changePasswordFormErrors.confirm_password}
				<div class="label">
					<span class="label-text-alt text-red-500">
						{changePasswordFormErrors.confirm_password}
					</span>
				</div>
			{/if}
		</label>
		<button
			type="submit"
			class="btn btn-primary text-white rounded-xl font-normal w-full"
		>
			Update Password
		</button>
	</form>

	<hr class="w-full" /> -->

	<h2 class="text-lg font-semibold pt-5 px-5">Edit Comment Templates</h2>
	<div class="flex flex-col gap-3 px-5">
		{#each comments as template, i}
			<div class="flex items-center gap-1">
				<div
					class="bg-white border grow rounded-xl flex items-center px-4 h-full"
				>
					{template}
				</div>
				<IconButton
					className={'p-3 bg-white'}
					icon={EditIcon}
					disabled={isSaving}
					onClick={() => editComment(i)}
				/>
				<IconButton
					disabled={isSaving}
					className={'p-3 bg-white text-red-600'}
					icon={DeleteIcon}
					onClick={() => onDeleteClick(i)}
				/>
			</div>
		{/each}
		<hr class="w-full" />
		<div class="flex items-start gap-1 w-full">
			<label class="form-control w-full font-normal">
				<input
					type="text"
					name="comment"
					id="new-comment"
					disabled={isSaving}
					placeholder="Type new comment here"
					class:input-error={newCommentTemplateError}
					class="input input-bordered rounded-xl w-full"
					bind:value={newCommentTemplate}
				/>
				{#if newCommentTemplateError}
					<div class="label">
						<span class="label-text-alt text-red-500"
							>{newCommentTemplateError}</span
						>
					</div>
				{/if}
			</label>
			<IconButton
				className={'p-3 border bg-white text-green-400'}
				icon={CheckIcon}
				onClick={onAddClick}
				disabled={isSaving}
			/>
			<IconButton
				className={'p-3 border bg-white text-red-600'}
				disabled={isSaving}
				icon={CancelIcon}
				onClick={onCancelEdit}
			/>
		</div>
		<hr class="w-full" />
	</div>
	<Button
		type="primary"
		title="Save"
		className="flex-none mx-5"
		onclick={onSaveClick}
		isLoading={isSaving}
		isDisabled={isSaving}
	/>
</div>
