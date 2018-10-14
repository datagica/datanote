

const pattern = /rgba?\( *(\d+) *, *(\d+) *, *(\d+) *(?:, *(\d+|\.\d+|\d+\.|\d+\.\d+) *)?\)/i

export default function changeOpacity(color, opacity) {
	color = color.trim()
	opacity = isFinite(opacity) && !isNaN(opacity) ? opacity : 1.0
	return opacity === 1.0
	  ? color.replace(pattern, "rgb($1, $2, $3)")
		: color.replace(pattern, "rgba($1, $2, $3, "+opacity+")")
}
