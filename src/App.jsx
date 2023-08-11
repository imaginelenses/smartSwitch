import { Component, Fragment } from 'react'
import Highlight from './SyntaxHighlight'
import Nunjucks from 'nunjucks'


import Template from '/templates/base.txt'
import GenerateKey from './generateKey'
import PartitionedInput from './PartitionedInput'
import './sass/App.scss'


class App extends Component {
  constructor() {
    super()
    this.state = {
      name: '',
      friendly_name: '',
      wakeonlan: false,
      target_mac_address: '',
      encryption_key: GenerateKey(32),
      ota_password: GenerateKey(12),
      manual_ip: false,
      static_ip: '',
      gateway: '',
      subnet: '',
      ap_password: GenerateKey(8),
      switches: [],
      count: 0,
      pins: [
        {sensor: 13, output: 15},
        {sensor: 12, output:  2},
        {sensor: 14, output:  4},
        {sensor: 27, output: 16},
        {sensor: 26, output: 17},
        {sensor: 25, output:  5},
        {sensor: 33, output: 18},
        {sensor: 32, output: 19},
        {sensor: 35, output: 21},
        {sensor: 34, output: 22}, 
        {}
      ],
    }
    this.limit = 10
  }


  render() {
    let code = Nunjucks.render(Template, this.state)
    return (
      <form 
        ref={(form) => this.form = form}
        onSubmit={(e) => e.preventDefault()}>
        <h2 className="title">Smart Switch Configuration</h2>
        <div className="form">
          <div className="formItem"
            title="It should always be unique in your home network.
              May only contain lowercase characters, digits and hyphens,
              and can be at most 24 characters long.">
            <label htmlFor="#name">Name</label>
            <input type="text" id="name" autoFocus autoComplete="off" required
              value={this.state.name}
              onChange={(e) => {
                let name = e.target.value.toLowerCase()
                let pattern = '[0-9a-z-]'
                if (name !== '' && !this.validate(name, pattern)) {
                  return
                }
                this.setState({name})
              }}
              minLength="1"
              maxLength="24" />
          </div>
          
          <div className="formItem"
            title="This is the name used by Home Assistant as the device name,
              and is automatically prefixed to switches where necessary.">
            <label htmlFor="#friendly_name">Friendly Name</label>
            <input type="text" id="friendly_name" autoComplete="off" required
              value={this.state.friendly_name} 
              onChange={(e) => this.setState({ friendly_name: e.target.value})} 
              minLength='1' />
          </div>
          
          <div className="formItem checkbox" 
            title="Turn Home Assistant server on when device powers on.">
            <input type="checkbox" id="wakeonlan" checked={this.state.wakeonlan}
              onChange={(e) => this.setState({wakeonlan: e.target.checked})} />
            <label htmlFor="#wakeonlan">Server Wake On Lan</label>
          </div>

          { this.state.wakeonlan ? 
            <PartitionedInput
              cls="formItem"
              label="Server MAC Address"
              fields={6}
              minLength={2}
              maxLength={2}
              delimiter=":"
              pattern="[0-9A-Fa-f]"
              title="MAC Address of the Home Assistant Server.
                MAC Address must consist of 6 : (colon) separated parts."
              placeholder="1A:2B:3C:4D:5E:6F"
              handleChange={(value) => this.setState({ 'target_mac_address': value })}
            />                
            : null
          }
          
          <div className="formItem checkbox"
            title="Manually configure the static IP of the device.">
            <input type="checkbox" id="manual_ip" checked={this.state.manual_ip}
              onChange={(e) => this.setState({manual_ip: e.target.checked})} />
            <label htmlFor="#wakeonlan">Set IP Manually</label>
          </div>
          
          { this.state.manual_ip ? 
            <Fragment>
              <PartitionedInput
                cls="formItem"
                label="Static IP"
                fields={4}
                minLength={1}
                maxLength={3}
                delimiter="."
                pattern="[0-9]"
                title="The static IP of your device. 
                  IPv4 address must consist of four point-separated integers."
                placeholder="192.168.0.2"
                handleChange={(value) => this.setState({ 'static_ip': value })}
              />   
              <PartitionedInput
                cls="formItem"
                label="Gateway"
                fields={4}
                minLength={1}
                maxLength={3}
                delimiter="."
                pattern="[0-9]"
                title="The gateway of the local network. 
                  IPv4 address must consist of four point-separated integers."
                placeholder="192.168.0.1"
                handleChange={(value) => this.setState({ 'gateway': value })}
              />
              <PartitionedInput
                cls="formItem"
                label="Subnet"
                fields={4}
                minLength={1}
                maxLength={3}
                delimiter="."
                pattern="[0-9]"
                title="The subnet of the local network. 
                  IPv4 address must consist of four point-separated integers."
                placeholder="255.255.255.0"
                handleChange={(value) => this.setState({ 'subnet': value })}
              />
            </Fragment>
            : null
          }
        </div>

        <button type="submit"
          onClick={this.addSwitch}
          disabled={this.state.count >= this.limit}>
            Add Switch
        </button>
        
        { this.state.count ? 
          <div className="tableWrapper">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Device Pin</th>
                  <th>Switch Pin</th>
                  <th>Toggle</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {this.state.switches.map((swtch, i) =>
                  <tr key={i}>
                    <td title="What the switch controls.">
                      <select
                        value={swtch.type}
                        onChange={(e) => this.setState((state) => {
                          state.switches[i].type = e.target.value
                          return {switches: state.switches}
                        })} >
                        <option value="light">Light</option>
                        <option value="fan">Fan</option>
                      </select>
                    </td>
                    <td title="Unique ID of Switch. IDs must only consist of
                       upper/lowercase characters, the underscore character and numbers.">
                      <input type="text"
                        value={swtch.id}
                        placeholder="ID"
                        onChange={(e) => this.setState((state) => {
                          let id = e.target.value
                          let pattern = '[0-9A-Za-z_]'
                          if (id !== '' && !this.validate(id, pattern)) {
                            return
                          }
                          state.switches[i].id = id
                          return {switches: state.switches}
                        })} />
                    </td>
                    <td title="Name of the Switch.">
                      <input type="text"
                        value={swtch.name}
                        placeholder="Name"
                        onChange={(e) => this.setState((state) => {
                          state.switches[i].name = e.target.value
                          return {switches: state.switches}
                        })} />
                    </td>
                    <td>{swtch.output_pin}</td>
                    <td>{swtch.sensor_pin}</td>
                    <td className="checkbox"
                      title="Set Switch to be a toggle switch. Default is a
                        momentary switch.">
                      <input type="checkbox" checked={swtch.toggle}
                        onChange={(e) => this.setState((state) => {
                          state.switches[i].toggle = e.target.checked
                          return {switches: state.switches}
                        })} />
                    </td>
                    <td title="Remove Switch.">
                      <button onClick={() => this.removeSwitch(i)}>X</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          : <br />
        }
        
        <button type="submit"
          title="Download configuration file." 
          onClick={() => {
            if (!this.form.reportValidity()) {
              return
            }
            this.download.click()
          }}>
          &nbsp;Download&nbsp;
        </button>
        <a
          hidden={true}
          ref={(link) => this.download = link}
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(code)}`}
          download={`${this.state.name}_config.yaml`}>
        </a>

        <Highlight  
          code={code}
          language="yaml"
          handleCopy={() => {
            if (!this.form.reportValidity()) {
              return
            }
          }}
        />

        <footer>
          <a href="https://github.com/imaginelenses" target="_blank" role="button" aria-label="Checkout my GitHub.">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
          </a>
          <div>
            ©&nbsp;{(new Date).getFullYear()}&nbsp;
            <a href="imaginelenses.com">Imaginelenses</a>
          </div>
        </footer>
      </form>
    )
  }

  validate = (value, pattern) => {
    if (!value) {
      return false
    }

    let valid = true;
    [...value].forEach((letter) => { 
      if (!letter.match(pattern)) {
        valid = false
      }
    })
    
    return valid
  }

  handleChange = (key, value) => this.setState({ [key]: value })

  addSwitch = () => {
    if (this.state.count >= this.limit) {
      return
    }

    this.setState((state) => {
      let switches = [...state.switches]
      switches.push({
        type: 'light',
        output_id: `switch_${state.count + 1}`,
        output_pin: state.pins[state.count].output,
        id: '',
        name: '',
        sensor_name : `Switch ${state.count + 1}`,
        sensor_id: `switch_sensor_${state.count + 1}`,
        sensor_pin: state.pins[state.count].sensor,
        toggle: false
      })
      state.count++
      return {switches, count: state.count}
    })
  }

  removeSwitch = (index) => {
    if (index > this.state.count) {
      return
    }

    this.setState((state) => {
      let switches = [...state.switches]
      switches.splice(index, 1)

      let pins = [...state.pins]
      let availablePins = pins.splice(index, 1)
      pins.splice(-1, 0, availablePins[0])

      state.count--
      return {switches, pins, count: state.count}
    })
  }

  addScript = (src) => {
    const script = document.createElement("script")
    script.src = src
    script.async = true
    document.body.appendChild(script)
  }
}

export default App
