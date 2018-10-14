'use strict'

import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {toJS, runInAction} from 'mobx'

import { withRouter } from 'react-router'

import projectStore from '~/stores/project'
import uiStore      from '~/stores/ui'

import Dialog from 'material-ui/Dialog'

import ContentAdd from 'material-ui/svg-icons/content/add'

import { Step, Stepper, StepLabel, StepButton } from 'material-ui/Stepper'

import MobxReactForm from 'mobx-react-form'
import validatorjs   from 'validatorjs'
import SelectField   from 'material-ui/SelectField'
import MenuItem      from 'material-ui/MenuItem'

import Card          from '~/views/Project/Settings/DialogComponents/Card'
import NameField     from '~/views/Project/Settings/DialogComponents/NameField'
import PathField     from '~/views/Project/Settings/DialogComponents/PathField'
import InputText     from '~/views/Project/Settings/DialogComponents/InputText'
import InputString   from '~/views/Project/Settings/DialogComponents/InputString'
import InputPassword from '~/views/Project/Settings/DialogComponents/InputPassword'
import InputJson     from '~/views/Project/Settings/DialogComponents/InputJson'
import InputNumber   from '~/views/Project/Settings/DialogComponents/InputNumber'
import InputUrl      from '~/views/Project/Settings/DialogComponents/InputUrl'

import { RadioButton,
         RadioButtonGroup } from 'material-ui/RadioButton'
import FlatButton           from 'material-ui/FlatButton'
import RaisedButton         from 'material-ui/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Toggle               from 'material-ui/Toggle'
import TextField            from 'material-ui/TextField'

import styles from './styles'

const reactFormPlugins = { dvr: validatorjs }

function getFields (key, values, depth = 0) {

  // console.log("getFields", { key, values, depth })

  if (!values) {
    // console.log("returning null")
    return null
  }

  const label = values.label && values.label.en ? values.label.en : ""
  const value = values.value
  const type  = values.type

  // console.log("getFields DEBUG=", {  key, values, depth, label, value, type })

  if (!type) {
    // console.log("NO TYPE BUT SUBFIELDS!")
    return Object.keys(values).map(subKey => getFields(`${key}.${subKey}`, values[subKey], depth))
  }

  switch (type) {
    case "group":
    // depth < 1 ? styles.formGroup : styles.subFormGroup
      return (
      <div style={ styles.subFormGroup }>
        <h3  style={ depth < 1 ? styles.formGroupLabel : styles.subFormGroupLabel }>{label}</h3>
        {Object.keys(value).map(subKey =>
          <div key={`${key}_${subKey}`} style={ depth < 1 ? styles.formRow : styles.subFormRow }>
            {getFields(`${key}_${subKey}`, value[subKey], depth + 1)}
          </div>
        )}
      </div>
      )

      case "list":
      if (!Array.isArray(value)) {
        console.log("sorry: you said type was list, but value isn't an array")
        return null
      }
      return (
      <div style={ styles.subFormGroup }>
        <h3  style={ depth < 1 ? styles.formGroupLabel : styles.subFormGroupLabel }>{label}</h3>
        {value.map((row, i) =>
          <div key={`${key}_${i}`} style={ depth < 1 ? styles.formRow : styles.subFormRow }>
            {getFields(`${key}_${i}`, row, depth + 1)}
          </div>
        )}
      </div>
      )

    case "uri": case "url":
      return <InputUrl
        name={key}
        hint={value}
        label={label}
        onChange={(_, txt) => (values.value = txt)}
      />

    case "file": case "files": case "filepath": case "path": case "filelist":
      return <PathField
        name={key}
        onChange={(_, list) => (values.value = list)}
      />

    case "number": case "int": case "integer": case "float":
      return <InputNumber
        name={key}
        hint={value}
        label={label}
        onChange={(_, txt) => {
          values.value = Number(txt.trim())
        }}
      />

    case "boolean": case "toggle": case "bool":
      return <Toggle
        name={key}
        label={label}
        onChange={(_, txt) => {
          const strval = txt.toLowerCase().trim()
          values.value =
              strval === 'true'  ? true
            : strval === 'false' ? false
            : Boolean(strval)
        }}
        defaultToggled={value === "true" || value === true}
      />

    case "object": case "map": case "json":
      return <InputJson
        name={key}
        hint={value}
        label={label}
         onChange={(_, txt) => {
           try {
             values.value = JSON.parse(txt)
           } catch (err) {
             console.error("couldn't parse json: ", err)
             values.value = {}
           }
         }}
        />

    case "password":
      return <InputPassword
        name={key}
        hint={value}
        label={label}
        onChange={(_, value) => (values.value = value)}
      />

    case "javascript":
      return <InputEditor
        name={key}
        value={value}
        onChange={value => (values.value = value)}
      />
  case "text":
    return <InputText
      name={key}
      hint={value}
      label={label}
      onChange={(_, value) => (values.value = value)}
    />

    case "string":
      return <InputString
        name={key}
        hint={value}
        label={label}
        onChange={(_, value) => (values.value = value)}
      />

    default:
       return null
  }
  return null
}

/**
 * Edit new source settings
 */

 @withRouter
class SourceSetup extends Component {

  constructor(props) {
    super(props)
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    finished: false,
    saving: false,
    stepIndex: 0,
    bundleId: '',
    bundleData: {},
    templateId: '',
    templateData: {},
    sourceName: "My Source"
  }

  handleNext = () => {
    const {stepIndex} = this.state
    this.setState({ stepIndex: stepIndex + 1, finished: stepIndex >= 2 })
  }

  handlePrev = () => {
    const {stepIndex} = this.state
    if (stepIndex > 0) this.setState({stepIndex: stepIndex - 1 })
  }

  handleSelectSource = (bundleId, templateId) => {
    const bundleData = this.props.data[bundleId]
    this.setState({
      bundleId    : bundleId,
      bundleData  : bundleData,
      templateId  : templateId,
      templateData: ((typeof bundleData.meta !== 'undefined') ? bundleData.meta[templateId] : {}),
      stepIndex   : 1,
      finished   : false
    })
  }

  handleSaveSource = () => {
    this.setState({ saving: true })
    projectStore.getOrMake(this.state.sourceName).then(projectId => {
      this.setState({ saving: false })
      projectStore.newSource({
        bundleId  : this.state.bundleId, // eg. "filesystem"
        templateId: this.state.templateId, // eg. "local"
        sourceName: this.state.sourceName,
        isActive  : true,
        settings  : this.state.templateData.settings
      }).then(res => {
        this.props.history.push('/project')
        console.log("SourceSetup.handleSaveSource: created new source", res)
        if (this.props.onRequestClose instanceof Function) {
          this.props.onRequestClose()
        }
      }).catch(err => {
        console.error("SourceSetup.handleSaveSource: couldn't create source: ", err)
      })
    })
  }

  getSources() {
    const moduleList = Object.keys(this.props.data).sort()
    return moduleList.reduce((sources, bundleId) => {
      const bundleData = this.props.data[bundleId]
      const templateList = Object.keys(bundleData.meta).sort()
      return sources.concat(templateList.map(templateId => {
        const templateData = bundleData.meta[templateId]
        return <Card
          key={`${bundleId}--${templateId}`}
          isSelected={this.state.templateId == templateId}
          title={templateData.templateLabel ? templateData.templateLabel.en : 'Untitled'}
          subtitle={templateData.templateDescription ? templateData.templateDescription.en : ''}
          onClick={() => this.handleSelectSource(bundleId, templateId)}
        />
      }))
    }, [])
  }

  getSettings(){
    const bundleId   = this.state.bundleId
    const templateId = this.state.templateId
    const provider   = this.props.data[bundleId]

    if (!provider || !provider.meta) {
      return (
        <p>Please select a valid provider (step 1)</p>
      )
    }
    const source = provider.meta[templateId]

    if (!source || !source.settings) {
      return (
        <p>Please select a valid source (step 1)</p>
      )
    }
    //console.log("source.settings: ", source.settings)
    return (
      <div>
        <NameField
          value={this.state.sourceName}
          onChange={ name => this.setState({ sourceName: name }) }
        />
        {getFields("settings", source.settings)}
        {this.state.saving
          ? <FlatButton label="Save" disabled />
          : <FlatButton label="Save" onClick={this.handleSaveSource} />
        }
      </div>
    )
  }
  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:  return this.getSources()
      case 1:  return this.getSettings()
      default: return <p>Looks like you're ready to go!</p>
    }
  }

  render() {
    const { finished, stepIndex } = this.state
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.stepContent}>{this.getStepContent(stepIndex)}</div>
        </div>
      </div>
    )
  }
}


export default SourceSetup
