import { toast } from "svelte-sonner";

export async function handleUpdate(data: { id: string; startTime: string; endTime: string }) {
	const res = await fetch('/time-availability', {
		method: 'PUT',
		body: JSON.stringify(data)
	}).then((r) => r.json());
	return res;
}

export async function handleAdd(data: {
	osteopathId: string;
	day: string;
	startTime: string;
	endTime: string;
}) {
	const res = await fetch('/time-availability', {
		method: 'POST',
		body: JSON.stringify(data)
	}).then((r) => r.json());
	return res;
}

export async function handleDelete(data: {
	id:string;
}) {
	const id = toast('deleting your time-slot',{
		duration: 5000
	})
	const res = await fetch('/time-availability', {
		method: 'DELETE',
		body: JSON.stringify(data)
	}).then((r) => r.json());
	toast.dismiss(id)
	return res;
}
