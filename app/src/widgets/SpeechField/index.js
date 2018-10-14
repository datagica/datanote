'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import API from '~/api/index'

import SvgIcon      from 'material-ui/SvgIcon'
import TextField    from 'material-ui/TextField'
import AutoComplete from 'material-ui/AutoComplete'
import MenuItem     from 'material-ui/MenuItem'
import FlatButton   from 'material-ui/FlatButton'

import styles from './styles'

const MicIcon = (props) => (
  <SvgIcon viewBox="0 0 512 512" {...props}>
    <path d="M112.1,238.1l-0.1,13.6c0.1,65.6,46,120.6,108.1,136.2c1.3,0.1,2.6,0.5,3.8,0.9c5.9,2,10.1,6.9,12.1,12.8v58.7
		c0,10.9,8.9,19.7,20,19.7h0.1c11.1,0,19.9-8.8,19.9-19.7v-58.8c2-5.9,6.1-10.7,12-12.7c1.2-0.4,2.5-0.8,3.9-0.9
		C354,372.3,400,317.3,400,251.7v-13.6c0-10.4-8.9-18.9-19.5-18.9c-10.6,0-19.5,8.4-19.5,18.9v13.6c0,28.5-11.5,54.1-30.6,72.8
		c-19.2,18.6-45.3,30.2-74.5,30.2c-29.2,0-55.1-11.5-74.2-30.2c-19.1-18.7-30.7-44.4-30.7-72.8v-13.6c0-10.4-8.8-18.9-19.5-18.9
		C120.9,219.2,112.1,227.7,112.1,238.1z"/>
	<path d="M179,107.7v143.8c0,41.8,34.7,75.7,77.5,75.7c42.8,0,77.5-33.9,77.5-75.7V107.7c0-41.8-34.7-75.7-77.5-75.7
		C213.7,32,179,65.9,179,107.7z"/>
  </SvgIcon>
);


// see https://github.com/somonus/react-speech-recognition-input/blob/master/src/index.js
// for an example
// also, use widgets/generic/Iris

class SpeechField extends Component {

  constructor(props, context){
    super(props, context)
    this.state = {
      inputValue: '',
      supportVoice: 'webkitSpeechRecognition' in window,
      dataSource: [],
    };
  }

  getSuggestions = (value) => {
    console.log("SpeechField.getSuggestions: ", value);
    API.suggest(`${value}`).then(newData => {
      newData = Array.isArray(newData) ? newData : [];
      console.log("got newData: ", newData);

      // allow the user type garbage without flashing the screen!
      if (newData.length == 0) return;

      this.setState({
        dataSource: newData
      })
    })
  }

  componentDidMount() {
    console.log("SpeechField.componentDidMount")
    if (!this.state.supportVoice) return;

    const WebkitSpeechRecognition = window.webkitSpeechRecognition;

    console.log("installing recognition engine: ", WebkitSpeechRecognition)
    this.recognition = new WebkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    //this.recognition.lang = 'cmn-Hans-CN';
    //this.recognition.lang = 'fr-FR';
    this.recognition.lang = 'en-US';

    this.recognition.onend = (e) => {
      console.log("recognition ended: ", e)
    }

    this.recognition.onerror = (e) => {
      // console.error("speech recognition error:", e);
      console.log('Speech recognition error detected: ' + event.error);
      console.log('Additional information: ' + event.message);
    }

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      console.log("SpeechField.onresult:", event);
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        console.log("   - result:", event.results[i]);
        if (event.results[i].isFinal) {
          console.log("isFinal!!");
          finalTranscript += event.results[i][0].transcript;
          console.log("SpeechField.finalTranscript: ", finalTranscript);
          this.setState({
            inputValue: finalTranscript,
          });
          if (this.props.onChange) this.props.onChange(finalTranscript);
          if (this.props.onEnd) this.props.onEnd(finalTranscript);
        } else {
          interimTranscript += event.results[i][0].transcript;
          this.setState({
            inputValue: interimTranscript,
          });
          if (this.props.onChange) this.props.onChange(interimTranscript);
        }
      }
    };
    console.log("SpeechField: recognition engine installed!");
  }

  changeValue(event) {
    console.log("SpeechField.changeValue", event.target.value)
    this.setState({
      inputValue: event.target.value,
    });
  }

  onNewRequest = (string, index) => {
    if (this.props.onChange) this.props.onChange(string);
  }

  toggleMic() {
    console.log("SpeechField.toggleMic");
    if (!this.state.supportVoice) return;
    if (!this.state.speaking) {
      console.log("SpeechField.toggleMic: starting the recognition..");
      // start listening
      this.recognition.start();
    } else {
      console.log("SpeechField.toggleMic: ending the recognition..");
      this.recognition.stop();
      const question = this.state.inputValue;
      console.log("question: "+this.state.inputValue);
    }
    console.log(`SpeechField.toggleMic: going to set state to `, {
      speaking: !this.state.speaking,
      inputValue: '',
    })
    this.setState({
      speaking: !this.state.speaking,
      inputValue: '',
    });
  }

  render(){
    console.log("SpeechField.render")
    return (
      <AutoComplete
         hintText="search.."
         hintStyle={styles.textFieldHint}
         textFieldStyle={styles.textFieldInput}
         underlineStyle={styles.textFieldUnderline}
         underlineFocusStyle={styles.textFieldUnderlineFocus}
         menuStyle={styles.menu}
         dataSource={this.state.dataSource.map(item => {
           //console.log("rendering source: ", item);
             /*
             {
              "userText": "show me the",
              "fixedText": "show me the entities similar to",
              "value": "virus",
              "fullText": "show me the entities similar to virus",
              "fullWords": [
                "show",
                "me",
                "the",
                "entities",
                "similar",
                "to",
                "virus"
              ]
            }
            */
             const idx = item.fullText.toLowerCase().indexOf(item.userText);
             const left  = (idx >= 0) ? item.userText : "";
             const right = (idx >= 0) ? item.fullText.slice(idx + item.userText.length) : item.fullText;

             return {
               text: item.fullText,
               value: (
              <MenuItem>
                <span>{left}</span><span style={{fontWeight: 400}}>{right}</span>
              </MenuItem>
              )
            }

           })}
         onNewRequest={this.onNewRequest}
         onUpdateInput={this.getSuggestions}
         onKeyDown={(event) => {
          console.log("ON KEYDOWN: "+event.target.value+" (buffer: "+this.state.inputValue+")")
           if (event.keyCode === 13) {
             console.log("keycode is submit!")
             this.props.onSubmit(event.target.value)
           }
         }}
         searchText={this.state.inputValue}
         fullWidth={false}
         style={this.props.style}
       />
    )
  }
}
/*


<FlatButton label={"speak"} onClick={this.toggleMic} />

OR

<MicIcon
  style={styles.micIcon}
  color={styles.micIconColor}
  onClick={this.toggleMic} />

*/

export default SpeechField;
