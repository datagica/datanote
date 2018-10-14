
import getLabel from '~/utils/data/getLabel'

export default function getFirstItemLabel(item, locale) {
	if (Array.isArray(item) && item.length > 0) {
		item = item[0]
	}
	return getLabel(item, locale, '' + item)
}
