const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000'});

  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: '1000000'
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);

});

describe('Campaigns', () => {
  it('提交CreateCampaign 与 FactoryCampaign智能合约成功', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('CampaignFactory 调用者作为发起者', async () => {
    const manager = await campaign.methods.manager().call();

    assert.equal(accounts[0], manager);
  });

  it('让投资方投资以太币并且他们作为投资者', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1]
    });

    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it('要求投资至少发起者定义的金额以上', async () => {
    try {
      await campaign.methods.contribute().send({
        value: '5',
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
});
