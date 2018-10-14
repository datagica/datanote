
/**
 * List of properties that we can display in a Record Collection
 *
 */
export const recordTableFields = {
  /*
  bundleId: {
   dataKey: 'bundleId',
   label: {
     en: 'Bundle',
     fr: 'Bundle'
   },
   sortOrder: 1,
   width: 60
 },
 templateId: {
   dataKey: 'templateId',
   label: {
     en: 'Template',
     fr: 'Template'
   },
   sortOrder: 2,
   width: 60
 },
 */
 label: {
   dataKey: 'label',
   label: {
     en: 'Name',
     fr: 'Nom'
   },
   sortOrder: 3,
   width: 300
 },
 date: {
   dataKey: 'date',
   label: {
     en: 'Date',
     fr: 'Date'
   },
   sortOrder: 4,
   width: 115
 },
 datetime: {
   dataKey: 'datetime',
   label: {
     en: 'Date',
     fr: 'Date'
   },
   sortOrder: 4,
   width: 115
 },
 time: {
    dataKey: 'time',
    label: {
      en: 'Time',
      fr: 'Heure'
    },
    sortOrder: 4,
    width: 100
 },
 rank: {
   dataKey: 'rank',
   label: {
     en: 'Ranking',
     fr: 'Score'
   },
   sortOrder: 10,
   width: 120
 }
};


/**
 * List of properties that we can display in an Entity Collection
 *
 */
export const entityTableFields = {

  type: {
    dataKey: 'type',
    label: {
      en: 'Type',
      fr: 'Type'
    },
    sortOrder: 1,
    width: 130
  },

  label: {
    dataKey: 'label',
    label: {
      en: 'Name',
      fr: 'Nom'
    },
    sortOrder: 2,
    width: 230
  },

  date: {
    dataKey: 'date',
    label: {
      en: 'Date',
      fr: 'Date'
    },
    sortOrder: 4,
    width: 100
  },

  category: {
    dataKey: 'category',
    label: {
      en: 'Category',
      fr: 'Catégorie'
    },
    sortOrder: 5,
    width: 130
  },

  location: {
    dataKey: 'location',
    label: {
      en: 'Location',
      fr: 'Location'
    },
    sortOrder: 8,
    width: 220
  },

  rank: {
    dataKey: 'rank',
    label: {
      en: 'Ranking',
      fr: 'Classement'
    },
    sortOrder: 10,
    width: 120
  }
};



/**
 * List of properties that we can display in Record Metrics
 *
 */
export const recordMetricsFields = {
  // yes we do not compute metrics of records for now, only of entiies
};


/**
 * List of properties that we can display in Entity Metrics
 *
 * If one day we decide to apply some key to type mapping, that will be here
 * (eg for days or locations)
 *
 */
export const entityMetricsFields = {

  date: {
    dataKey: 'date',
    label: {
      en: 'Date',
      fr: 'Date'
    },
    type: 'datetime',
    excludeTypes: {
      generic: true
    }
  },

  timestamp: {
    dataKey: 'timestamp',
    label: {
      en: 'Timestamp',
      fr: 'Timestamp'
    },
    type: 'datetime'
  },

  datetime: {
    dataKey: 'datetime',
    label: {
      en: 'Date & Time',
      fr: 'Date & heure'
    },
    type: 'datetime'
  },

  category: {
    dataKey: 'category',
    label: {
      en: 'Category',
      fr: 'Catégorie'
    },
    excludeTypes: {
      generic: true
    }
  },

  'sub-category': {
    dataKey: 'sub-category',
    label: {
      en: 'Sub-category',
      fr: 'Sous-Catégorie'
    }
  },

  /*
  location: {
    dataKey: 'location',
    label: {
      en: 'Location',
      fr: 'Location'
    }
  },
  */

  age: {
    dataKey: 'age',
    label: {
      en: 'Age',
      fr: 'Age'
    },
    excludeTypes: {
      generic: true
    }
  },

  /*
  ranking is not interesting in the metrics
  rank: {
    dataKey: 'rank',
    label: {
      en: 'Ranking',
      fr: 'Classement'
    }
  },
  */

  // of course the person can integrate another culture later, or be of another
  // original culture
  culture: {
    dataKey: 'culture',
    label: {
      en: 'Culture',
      fr: 'Culture'
    }
  },

  language: {
    dataKey: 'language',
    label: {
      en: 'Language',
      fr: 'Langue'
    }
  },

  // in addition to "label" which can be a complex and translated formatted string,
  //  we can also have a "title" (eg. for honorific titles)
  title: {
    dataKey: 'title',
    label: {
      en: 'Title',
      fr: 'Titre'
    }
  },

  gender: {
    dataKey: 'gender',
    label: {
      en: 'Gender',
      fr: 'Genre'
    },
    excludeTypes: {
      generic: true
    }
  },

  position: {
    dataKey: 'position',
    label: {
      en: 'Position',
      fr: 'Position'
    }
  },

  size: {
    dataKey: 'size',
    label: {
      en: 'Size',
      fr: 'Taille'
    },
    excludeTypes: {
      generic: true
    }
  },

  price: {
    dataKey: 'price',
    label: {
      en: 'Price',
      fr: 'Prix'
    }
  }
};




export function getTableColumns (columns, collectionType) {
  const fields = collectionType === 'record' ? recordTableFields : entityTableFields
  return columns
    .map(key => fields[key])
    .filter(field => !!field)
    .sort((field1, field2) => field1.sortOrder - field2.sortOrder)

    // translation step - could be done somewhere else
    .map(field => Object.assign({}, field, { label: field.label.en }))
}

export function getMetricsColumns (columns, collectionType) {
  const fields = collectionType === 'record' ? recordMetricsFields : entityMetricsFields
  return columns
    .map(key => fields[key])
    .filter(field => !!field)

    // not so important for metrics though
    .sort((field1, field2) => field1.sortOrder - field2.sortOrder)

    // translation step - could be done somewhere else
    .map(field => Object.assign({}, field, { label: field.label.en }))
}
