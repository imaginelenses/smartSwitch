import { Component, Fragment } from "react";
import './sass/App.scss'


class PartitionedInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    for(let i = 0; i < props.fields; i++) {
      this.state[`field_${i}`] = ""
    }

    if (props.placeholder) {
      this.placeholders = props.placeholder.split(props.delimiter)
      if (this.placeholders.length !== props.fields) {
        throw new Error("Number of fields no not match placeholder length.")
      }
    }
  }

  render() {
    return (
      <div className={this.props.cls}>
        <label htmlFor=".partitionedInputWrapper">{this.props.label}</label>
        <div className="partitionedInputWrapper">
          {[...Array(this.props.fields)].map((_, i) => 
          <Fragment key={i}>
            <input type="text" id={`field_${i}`} 
              ref={(input) => {this[`field_${i}`] = input}}
              value={this.state[`field_${i}`]}
              onChange={(e) => this.handleChange(e, i)}
              onKeyDown={(e) => this.handleKeyDown(e, i)}
              onPaste={(e) => this.handlePaste(e, i)}
              size={this.props.length}
              minLength={this.props.length}
              maxLength={this.props.length}
              placeholder={this.placeholders ? this.placeholders[i] : ""}
              pattern={this.props.pattern}
              title={this.props.title}
              autoFocus={i === 0 && this.props.autoFocus}
              disabled={!(i === 0 || this.state[`field_${i - 1}`])}
              required 
              style={{ width: `${this.props.length}.5em` }}
              />
            {i < this.props.fields - 1 ? <strong>{this.props.delimiter}</strong> : ""}
          </Fragment>
          )}
        </div>
      </div>
    )
  }

  validate = (value) => {
    if (!value) {
      return false
    }

    let valid = true;
    [...value].forEach((letter) => { 
      valid = letter.match(this.props.pattern)
    })
    
    return valid
  }

  handleChange = (event, index) => {
    let value = event.target.value
    if (!this.validate(value)) {
      return
    }

    if (index === this.props.fields - 1 && 
      value.length > this.props.length) {
      return
    }

    this.setState({[`field_${index}`] : value})
    
    if (value.length === this.props.length) {
      let next = index + 1
      if (next < this.props.fields) {
        this[`field_${next}`].focus()
      }
    }

  }

  handleKeyDown = (event, index) => {
    if (event.key !== "Backspace") {
      return
    }

    event.preventDefault()

    if (event.target.value) {
      this.setState((state) => {
        let temp =  state[`field_${index}`].split("")
        temp.pop()
        temp = temp.join("")
        return {[`field_${index}`] : temp}
      })
      return
    }

    if (index > 0) {
      this[`field_${index - 1}`].focus()
    }
  }

  handlePaste = (event, index) => {
    event.preventDefault()

    let paste = (event.clipboardData || window.clipboardData).getData("text")
    
    let pasteFields = paste.split(this.props.delimiter)
    if (pasteFields.length !== this.props.fields) {
      console.error(`Content you're trying to paste is of incorrect format. \n"${paste}"`)
      return
    }

    let fields = {}
    for (let [i, field] of pasteFields.entries()) {
      if (!this.validate(field)) {
        console.error(`${field} in ${paste} is not valid.`)
        return
      }
      fields[`field_${i}`] = field
    }

    this.setState(fields)
  }
}

export default PartitionedInput