'use strict'

import isPrintable from '~/utils/validators/isPrintable'
import isString    from '~/utils/validators/isString'


/*
 * Find the best label of an entity
 * This function is.. complicated, because it supports multiple formats of
 * objects of various kinds and standards, so it's pretty handy but maybe
 * could be optimized to avoid duplicate checks
 */
export default function getLabel(item, locale, orElse) {

	orElse = isString(orElse) ? orElse : ''

	const itemIsPrintable = isPrintable(item)
	const itemIsObject    = item instanceof Object

	const itemExists = itemIsPrintable || itemIsObject

	if (!itemExists) {
		return orElse
	}

	if (itemIsPrintable) {
		return ''+ item
	}


	// TODO should come from the user preferences
	const defaultLocale = 'en'


		// search for localized composite objects
	const hasValidValue = typeof item.value !== 'undefined'
	const hasValidLabel = typeof item.label !== 'undefined'
	const hasValidName  = typeof item.name  !== 'undefined'

	const hasValidValueLabel = hasValidValue && typeof item.value.label !== 'undefined'
	const hasValidValueName  = hasValidValue && typeof item.value.name  !== 'undefined'

	return '' + (
	  (hasValidValue && hasValidValueLabel && isPrintable(item.value.label[locale]))
		? item.value.label[locale]
		: (hasValidValue && hasValidValueLabel && isPrintable(item.value.label[defaultLocale]))
		? item.value.label[defaultLocale]
		: (hasValidValue && isPrintable(item.value.label))
		? item.value.label
		: (hasValidValue && hasValidValueName && isPrintable(item.value.name[locale]))
		? item.value.name[locale]
		: (hasValidValue && hasValidValueName && isPrintable(item.value.name[defaultLocale]))
		? item.value.name[defaultLocale]
		: (hasValidValue && isPrintable(item.value.name))
		? item.value.name
		: (hasValidValue && isPrintable(item.value[locale]))
		? item.value[locale]
		: (hasValidValue && isPrintable(item.value[defaultLocale]))
		? item.value[defaultLocale]
		: (hasValidValue && typeof item.value.id !== 'undefined') // we are less strict on the id
		? item.value.id
		: (hasValidLabel && isPrintable(item.label[locale]))
		? item.label[locale]
		: (hasValidLabel && isPrintable(item.label[defaultLocale]))
		? item.label[defaultLocale]
		: isPrintable(item.label)
		? item.label
		: (hasValidName && isPrintable(item.name[locale]))
		? item.name[locale]
		: (hasValidName && isPrintable(item.name[defaultLocale]))
		? item.name[defaultLocale]
		: (hasValidName && isPrintable(item.name[locale]))
		? item[locale]
		: (hasValidName && isPrintable(item[defaultLocale]))
		? item[defaultLocale]
		: isPrintable(item.name)
		? item.name
		: isPrintable(item.value)
		? item.value
		: isPrintable(item.id)
		? item.id
		: orElse
	);
}
