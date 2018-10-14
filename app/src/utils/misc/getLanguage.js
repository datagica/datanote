'use strict'

export default function getLanguage () {

   // navigator.language || navigator.browserLanguage || 'en-US'

  return (
    navigator.language
     ? navigator.language :

    navigator.userLanguage
     ? navigator.userLanguage :

    'en-US'
  )
}
