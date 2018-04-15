import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x5f14B328e7eF8f60D9DA4301B5b513ADbc38d0cc'
);

export default instance;
