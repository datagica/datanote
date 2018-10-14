export default function capitalize(str) {
	return typeof str !== 'string' ? '' : str.toLowerCase().charAt(0).toUpperCase() + str.slice(1);
}
