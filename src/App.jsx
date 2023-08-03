import { Component, Fragment } from 'react'
import Code from './Code'
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
      wakeonlan: true,
      target_mac_address: '',
      encryption_key: GenerateKey(32),
      ota_password: GenerateKey(12),
      manual_ip: true,
      static_ip: '',
      gateway: '',
      subnet: '',
      ap_password: GenerateKey(8),
    }
  }

  render() {
    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <h2>Device Configuration</h2>
        <div className="form">
          <div className="formItem">
            <label htmlFor="#name">Name</label>
            <input type="text" id="name" autoFocus autoComplete="off" required
              value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />
          </div>
          <div className="formItem">
            <label htmlFor="#friendly_name">Friendly Name</label>
            <input type="text" id="friendly_name" autoComplete="off"
              value={this.state.friendly_name} 
              onChange={(e) => this.setState({ friendly_name: e.target.value})} 
              minLength='1'
              maxLength='5'/>
          </div>
          
          <div className="formItem checkbox">
            <input type="checkbox" id="wakeonlan" checked={this.state.wakeonlan}
              onChange={(e) => this.setState({wakeonlan: e.target.checked})} />
            <label htmlFor="#wakeonlan">Server Wake On Lan</label>
          </div>

          { this.state.wakeonlan ? 
            <PartitionedInput
              cls="formItem"
              label="Server MAC Address"
              fields={6}
              length={2}
              delimiter=":"
              pattern="[0-9A-Fa-f]"
              title="MAC Address must consist of 6 : (colon) separated parts."
              placeholder="1A:2B:3C:4D:5E:6F"
            />                
            : null
          }
          
          <div className="formItem checkbox">
            <input type="checkbox" id="manual_ip" checked={this.state.manual_ip}
              onChange={(e) => this.setState({manual_ip: e.target.checked})} />
            <label htmlFor="#wakeonlan">Set IP manually</label>
          </div>
          
          { this.state.manual_ip ? 
            <Fragment>
              <PartitionedInput
                cls="formItem"
                label="Static IP"
                fields={4}
                length={3}
                delimiter="."
                pattern="[0-9]"
                title="IPv4 address must consist of four point-separated integers."
                placeholder="192.168.0.2"
              />   
              <PartitionedInput
                cls="formItem"
                label="Gateway"
                fields={4}
                length={3}
                delimiter="."
                pattern="[0-9]"
                title="IPv4 address must consist of four point-separated integers."
                placeholder="192.168.0.1"
              />
              <PartitionedInput
                cls="formItem"
                label="Subnet"
                fields={4}
                length={3}
                delimiter="."
                pattern="[0-9]"
                title="IPv4 address must consist of four point-separated integers."
                placeholder="255.255.255.0"
              />
            </Fragment>
            : null
          }
        </div>
        
        <button type="submit">Submit</button>

        <Code  
          code={ Nunjucks.render(Template, this.state) }
          language="yaml"
        />
      </form>
    )
  }
}

export default App
