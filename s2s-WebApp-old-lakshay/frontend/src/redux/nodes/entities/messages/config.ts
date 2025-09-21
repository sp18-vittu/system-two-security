import Config from '../base/base'
import Synth from 'synth'

export default new Config({
  entityName: 'messages',
  loadAllFunc: Synth.messages.loadAll,
  loadFunc: Synth.messages.load,
  client: Synth,
})
