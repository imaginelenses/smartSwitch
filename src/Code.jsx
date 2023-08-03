import { Component } from 'react'
import { Highlight, themes } from 'prism-react-renderer'

export default class Code extends Component {
  constructor() {
    super()
    this.state = {}
  }

  render()  {
   return (
    <Highlight
      code={this.props.code}
      language={this.props.language}
      >
      {({ className, style, tokens, getLineProps, getTokenProps }) => {
        let padding = String(Math.max(tokens.length)).length
        return (
        <pre style={style}>
          {
            tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span>{ String(i + 1).padStart(padding, ' ') }</span>
                &nbsp;&nbsp;
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))
          }
        </pre>
      )}}
    </Highlight>
   ) 
  }
}

