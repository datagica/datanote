import Iframe from "react-iframe";

export default class Monster extends Component {
  constructor(props) {
    super(props)
    this.serviceRoutes = {
      login: "https://hiring.monster.com/login.aspx?redirect=http%3a%2f%2fhiring.monster.com%2fdefault.aspx%3fintcid%3dskr_www_intercept%26HasUserAccount%3d2"
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
