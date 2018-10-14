'use strict'

import React, {Component} from 'react'

import API from '~/api'

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

const reactFormPlugins = { dvr: validatorjs };

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

    case "text": case "string":
      return <InputText
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
 * Edit new parser settings
 */
export default class ParserSetup extends Component {

  state = {
    finished: false,
    saving: false,
    stepIndex: 0,
    bundleId: '',
    bundleData: {},
    templateId: '',
    templateData: {},
    parserName: "My Parser"
  };

  handleNext = () => {
    const {stepIndex} = this.state;
    this.setState({ stepIndex: stepIndex + 1, finished: stepIndex >= 2 });
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) this.setState({stepIndex: stepIndex - 1});
  };

  handleSelectBundle = (bundleId) => {
    this.setState({
      bundleId: bundleId,
      bundleData: this.props.data[bundleId],
      stepIndex: 1,
      finished: false
    })
  }

  handleSelectTemplate = (bundleId, templateId) => {
    const bundleData = this.props.data[bundleId];
    this.setState({
      bundleId    : bundleId,
      bundleData  : bundleData,
      templateId  : templateId,
      templateData: ((typeof bundleData.meta !== 'undefined') ? bundleData.meta[templateId] : {}),
      stepIndex   : 2,
      finished   : false
    })
  }

  handleSaveParser = () => {
    this.setState({ saving: true })
    const bundleData = this.props.data[this.props.bundleId];
    //console.log("bundleData: ", bundleData);
    //console.log("state: ", this.state)
    const parser = {
      bundleId  : this.state.bundleId, // eg. "filesystem"
      templateId: this.state.templateId, // eg. "local"
      parserName: this.state.parserName,
      isActive  : true,
      settings  : this.state.templateData.settings
    }
    console.log("ParserSetup.handleSaveParser: ", parser)
    API.newParser(parser).then(response => {
      //console.log("created new parser", response)
      if (this.props.onRequestClose instanceof Function) {
        this.props.onRequestClose()
      }
    }).catch(err => {
      console.error("couldn't create parser: ", err)
    })
  }


  getBundles(){
    const moduleList = Object.keys(this.props.data).sort();
    return moduleList.map(bundleId => {
      const bundleData = this.props.data[bundleId]
      return <Card
        key={bundleId}
        isSelected={this.state.bundleId == bundleId}
        title={bundleData.label ? bundleData.label.en : 'Untitled'}
        subtitle={bundleData.description ? bundleData.description.en : ''}
        onClick={() => this.handleSelectBundle(bundleId)}
      />
    })
  }
  getTemplates() {

    const bundleId     = this.state.bundleId;
    const bundleData   = this.props.data[bundleId];
    const templateList = Object.keys(bundleData.meta).sort();

    return templateList.map(templateId => {
      const templateData = bundleData.meta[templateId];
      return <Card
        key={templateId}
        isSelected={this.state.templateId == templateId}
        title={templateData.templateLabel ? templateData.templateLabel.en : 'Untitled'}
        subtitle={templateData.templateDescription ? templateData.templateDescription.en : ''}
        onClick={() => this.handleSelectTemplate(bundleId, templateId)}
      />
    })
  }
  getSettings(){
    const bundleId   = this.state.bundleId;
    const templateId = this.state.templateId;

    //console.log("this.data: ", this.props.data);

    const provider = this.props.data[bundleId];

    //console.log("provider: ", provider)

    if (!provider || !provider.meta) {
      return (
      <p>Please select a valid provider (step 1)</p>
    )
    }
    const parser = provider.meta[templateId]

    if (!parser || !parser.settings) {
      return (
        <p>Please select a valid provider parser (step 2)</p>
      )
    }
    //console.log("parser.settings: ", parser.settings)
    return (
      <div style={ styles.formGroup }>
        <NameField value={this.state.parserName} onChange={ name => this.setState({ parserName: name }) } />
        {getFields("settings", parser.settings)}
        {this.state.saving
          ? <FlatButton label="Add Parser" disabled />
          : <FlatButton label="Add Parser" onClick={this.handleSaveParser} />
        }
      </div>
    )
  }
  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:  return this.getBundles()
      case 1:  return this.getTemplates()
      case 2:  return this.getSettings()
      default: return <p>Looks like you're ready to go!</p>
    }
  }

  render() {
    const {finished, stepIndex} = this.state;
    return (
      <div style={styles.container}>
        <Stepper activeStep={stepIndex} linear={false} style={styles.stepper}>
          <Step>
            <StepButton style={styles.stepButton} onClick={() => this.setState({stepIndex: 0})}>
              Bundle
            </StepButton>
          </Step>
          <Step>
            <StepButton style={styles.stepButton} onClick={() => this.setState({stepIndex: 1})}>
              Template
            </StepButton>
          </Step>
          <Step>
            <StepButton style={styles.stepButton} onClick={() => this.setState({stepIndex: 2})}>
              Config
            </StepButton>
          </Step>
        </Stepper>
        <div style={styles.content}>
          <div style={styles.stepContent}>{this.getStepContent(stepIndex)}</div>
        </div>
      </div>
    );
  }
}
