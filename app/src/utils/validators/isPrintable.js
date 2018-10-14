import isFiniteNumber from '~/utils/validators/isFiniteNumber'
import isString       from '~/utils/validators/isString'

// check if an input is printable as a label (string or number)
export default function isPrintable(input) {
	return isString(input) || isFiniteNumber(input)
}
