import pickRGB      from '~/core/pickRGB'
import pickFontIcon from '~/core/pickFontIcon'

export default function getIcon (entityType, size = 25) {
	return {
		...pickFontIcon(entityType),
		color: pickRGB(entityType),
		size: size,
	}
}
