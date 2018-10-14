/*
Public: Renders a component provided via the `component` prop, and ensures that
failures in the component's code do not cause state inconsistencies elsewhere in
the application. This component is used by {InjectedComponent} and
{InjectedComponentSet} to isolate third party code that could be buggy.
Occasionally, having your component wrapped in {UnsafeComponent} can cause style
issues. For example, in a Flexbox, the `div.unsafe-component-wrapper` will cause
your `flex` and `order` values to be one level too deep. For these scenarios,
UnsafeComponent looks for `containerStyles` on your React component and attaches
them to the wrapper div:
```javascript
class MyComponent extends React.Component {
  displayName = 'MyComponent';
  containerStyles = {
    flex: 1
    order: 2
  }
}
```

Section: Component Kit
*/

import  React, { Component } from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash.omit'
import keys from 'lodash.keys'

class UnsafeComponent extends Component {
  static displayName = 'UnsafeComponent'

  /*
  Public: React `props` supported by UnsafeComponent:
   - `component` The {React.Component} to display. All other props will be
     passed on to this component.
  */

  static propTypes = {
    component: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.renderInjected()
  }

  componentDidUpdate() {
    this.renderInjected()
  }

  componentWillUnmount() {
    this.unmountInjected()
  }

  render() {
    return (<div
      name="unsafe-component-wrapper"
      style={this.props.component.containerStyles}></div>
    );
  }

  renderInjected() {
    const node = React.findDOMNode(this);
    let element = null;
    try {
      const props = omit(this.props, keys(this.constructor.propTypes));
      element = <@props.component key={name} {...props} />;
      this.injected = React.render(element, node);
    } catch (err) {
      console.error(err)
      const stack = err.stack;
      console.log stack
      stackEnd = stack.indexOf('/react/')
      if stackEnd > 0
        stackEnd = stack.lastIndexOf('\n', stackEnd)
        stack = stack.substr(0,stackEnd)

      element = <div className="unsafe-component-exception">
        <div className="message">{@props.component.displayName} could not be displayed.</div>
        <div className="trace">{stack}</div>
      </div>
    }
    this.injected = React.render(element, node)
  }

  unmountInjected() {
    try {
      node = React.findDOMNode(@)
      React.unmountComponentAtNode(node)
    } catch (err) {
    }
  }

  focus: =>
    # Not forwarding event - just a method call
    @injected.focus() if @injected.focus?

  blur: =>
    # Not forwarding an event - just a method call
    @injected.blur() if @injected.blur?
