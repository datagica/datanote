'use strict'

// see http://stackoverflow.com/questions/279749/detecting-the-system-dpi-ppi-from-js-css
// and http://www.geeksforgeeks.org/find-the-point-where-a-function-becomes-negative/
export default function findFirstPositive (b, a, i, c) {
  c=(d,e)=>e>=d?(a=d+(e-d)/2,0<b(a)&&(a==d||0>=b(a-1))?a:0>=b(a)?c(a+1,e):c(d,a-1)):-1
  for (i = 1; 0 >= b(i);) i *= 2
  return c(i / 2, i)|0
}
