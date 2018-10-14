
import colors from '~/config/colors'

export const defaultColor = 'black'


/*
some predefined concept-to-color mapping

please only input trimmed and lowercase keys, thanks.
*/
export const colorMapping = {
  '':                  defaultColor,

  'protein':           colors[0],
	'institution':       colors[0],
  'school':            colors[0],
  'university':        colors[0],

  'event':             colors[1],
  'birthdate':         colors[1],

  'person':            colors[2],
  'protagonist':       colors[2],
  'character':         colors[2],
  'individual':        colors[2],
  'drug':              colors[2],

	'workplace':         colors[3],
  'office':            colors[3],
  'location':          colors[3],

	'position':          colors[5],
  'job':               colors[5],
  'joboffer':          colors[5],
  'bug':               colors[5],
  'insect':            colors[5],
  'cell':              colors[5],

  'diploma':           colors[6],
  'criminalevidence':  colors[6],
  'evidence':          colors[6],

  'arterie':           colors[7],
  'skill':             colors[7],

  'fact':              colors[9],
  'phone':             colors[9],

  'disease':           colors[10],

  'virus':             colors[11],
  'viruses':           colors[11],

  'language':          colors[12],
	'weapon':            colors[12],
	'bacteria':          colors[12],

  // 13 is a bit of a sad petroleum blue

  'nerve':             colors[14], // or palette[6]
  'email':             colors[14], // or palette[6]

};

/*
some predefined concept-to-fontIcon mapping

please only input trimmed and lowercase keys, thanks.
*/
export const iconMapping = {
  '':                  'FontAwesome \uf1b2',
	'skill':             'FontAwesome \uf05d',

	'institution':       'FontAwesome \uf19c',
  'school':            'FontAwesome \uf19c',
  'university':        'FontAwesome \uf19c',

	'workplace':         'FontAwesome \uf0f7',
  'office':            'FontAwesome \uf0f7',

	'language':          'FontAwesome \uf0ac',
  'phone':             'FontAwesome \uf095',
  'birtdate':          'FontAwesome \uf1fd',
  'email':             'FontAwesome \uf1fa',
	'diploma':           'FontAwesome \uf19d',

	'position':          'FontAwesome \uf0b1',
  'job':               'FontAwesome \uf0b1',
  'joboffer':          'FontAwesome \uf0b1',

	'policeevent':       'FontAwesome \uf132',
  'event':             'FontAwesome \uf132',

  // tag
	'criminalevidence':  'FontAwesome \uf02b',
  'evidence':          'FontAwesome \uf02b',
	'disease':           'FontAwesome \uf02b',

  'person':            'FontAwesome \uf183',
	'protagonist':       'FontAwesome \uf183',
  'character':         'FontAwesome \uf183',
  'individual':        'FontAwesome \uf183',

	'weapon':            'FontAwesome \uf135',

	'bug':               'FontAwesome \uf188',
  'insect':            'FontAwesome \uf188',

	'bacteria':          'FontAwesome \uf069',

  'arterie':           'FontAwesome \uf21e',

	'virus':             'FontAwesome \uf0a3',
  'viruses':           'FontAwesome \uf0a3',

	'drug':              'FontAwesome \uf0c3',

  'nerve':             'FontAwesome \uf0e7',

	'fact':              'FontAwesome \uf19d',
  'generic':           'FontAwesome \uf19d',

  'place':             'FontAwesome \uf041',
  'location':          'FontAwesome \uf041',
  'city':              'FontAwesome \uf041',

  'cell':              'FontAwesome \uf22d',

  'protein':           'FontAwesome \uf1e0',

  'plant':             'FontAwesome \uf1bb', // or leaf (f06c)
  'tree':              'FontAwesome \uf1bb',

  'material':          'FontAwesome \uf219',

  'animal':            'FontAwesome \uf1b0', // paw
  'event':             'FontAwesome \uf06a',

  // other nice icons for chemistry are: eyedropper (f1fb) and tint (f043)


  // mostly for the list

  'pdf':               'FontAwesome \uf1c1',
  'excel':             'FontAwesome \uf1c3',
  'xls':               'FontAwesome \uf1c3',
  'csv':               'FontAwesome \uf1c3',
  'word':              'FontAwesome \uf1c2',
  'doc':               'FontAwesome \uf1c2',
  'odt':               'FontAwesome \uf1c2',
  'txt':               'FontAwesome \uf0f6',
  'json':              'FontAwesome \uf0f6',
  'html':              'FontAwesome \uf1c9',
  'xml':               'FontAwesome \uf1c9',
  'sql':               'FontAwesome \uf1c0',
  'database':          'FontAwesome \uf1c0',
  'db':                'FontAwesome \uf1c0',
};
