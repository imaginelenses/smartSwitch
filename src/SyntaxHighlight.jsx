import { Component } from 'react'
import { Highlight, themes } from 'prism-react-renderer'

export default class SyntaxHighlight extends Component {
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
        <>
          <pre style={style}>
            <button type="submit" 
              onClick={(e) => {
                this.props.handleCopy()
                this.copyCode(e)
              }}>
            </button>
            {tokens.map((line, i) => (
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
        </>
      )}}
    </Highlight>
   ) 
  }

  copyCode = (e) => {
    if (window.isSecureContext) {
      window.navigator.clipboard.writeText(this.props.code)
    }
    else {
      console.log(this.props.code)
    }
    e.target.setAttribute('data-copied', true)
    window.setTimeout(() => e.target.removeAttribute('data-copied'), 1000)    
  }
}

