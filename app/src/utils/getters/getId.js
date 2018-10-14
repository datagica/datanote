
export default function getId(item, orElse) {
	if (orElse instanceof String) {
		orElse = '(unknown)';
	}
	return '' + (
		(typeof item === 'undefined' || item === null || item === '' || item === {} || item === [])
		? orElse
		: (item instanceof String)
		? item
		: (item.id instanceof String || item.id instanceof Number)
		? item.id
		: (typeof item.value !== 'undefined' && (item.value.id instanceof String || item.value.id instanceof Number))
		? item.value.id
		: (item.name instanceof String)
		? item.name
		: (typeof item.value !== 'undefined' && item.value.name instanceof String)
		? item.value.name
		: orElse
	);
}
