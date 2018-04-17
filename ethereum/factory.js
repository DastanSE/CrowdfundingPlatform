import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x8d6600fe8Be473f61Ab534Ecd40F300138eF8e1A'
);

export default instance;
