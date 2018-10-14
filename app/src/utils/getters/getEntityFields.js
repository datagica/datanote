import getId    from '~/utils/data/getId'
import getLabel from '~/utils/data/getLabel'

export default function getEntityFields(fields, locale) {

	fields = Array.isArray(fields) ? fields : []

	return (item) => {

		const id    = getId(item)
		const label = getLabel(item, locale, id)

		const count = (typeof item !== 'undefined' && typeof item.count !== 'undefined')
      ? item.count
      : 0

		const obj = {
      id   : id,
      label: label,
      count: count
    }
		fields.map(key => {
			if (typeof item !== 'undefined' && typeof item[key] !== 'undefined') {
				obj[key] = item[key]
      }
		})
		return obj
	}
}
