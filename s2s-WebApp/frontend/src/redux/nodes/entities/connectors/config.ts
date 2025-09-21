import Config from '../base/base'
import Synth from 'synth'

export default new Config({
  entityName: 'connectors',
  loadAllFunc: Synth.connectors.loadAll,
  loadFunc: Synth.connectors.load,
  client: Synth,
})
