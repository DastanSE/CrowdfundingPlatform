const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory');
const mnemonic = 'decrease boss used edge disagree inspire gather cinnamon remember check sustain secret';

const provider = new HDWalletProvider(
  mnemonic,
  'https://rinkeby.infura.io/qTs2LFWovY1RmcqEOGD3'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  
  console.log('试从帐户进行部署', accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('智能合约提交/部署到', result.options.address);
};

deploy();
