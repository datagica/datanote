import Iframe from "react-iframe";

export default class Breaz extends Component {
  constructor(props) {
    super(props)
  }
  render(){
    const url = "https://breaz.io/login"
    return (
      <div>
      <Iframe
        url={url}
        width="1000px"
        height="900px" />

      </iframe>
      </div>
    )
  }
}

/* from there, we can programmatically remote control the IFrame eg.

var iframe = document.getElementById("my_iframe");
var buttom = iframe.contentWindow.document.getElementById('my_button');
iframe.contentWindow.fooBar();
*/
