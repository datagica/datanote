'use strict'

import React, {Component} from 'react'

import brace     from 'brace'
import AceEditor from 'react-ace'

import 'brace/mode/javascript'
import 'brace/theme/github'

import styles from './styles'

export default ({ name, value, onChange }) =>
<AceEditor
   mode="javascript"
   theme="github"
   onChange={onChange}
   name={name}
   editorProps={{$blockScrolling: true}}
   value={value}
   tabSize={4}
   minLines={10}
   maxLines={20}
 />
