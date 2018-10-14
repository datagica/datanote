import Iframe from "react-iframe";

export default class Toptal extends Component {
  constructor(props) {
    super(props)
    this.serviceRoutes = {
      login: "https://www.toptal.com/users/login"
    }
  }
  render(){
    return (
      <div>
      <Iframe
        url={this.serviceRoutes.login}
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
