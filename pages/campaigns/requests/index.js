import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import RequestRow from '../../../components/RequestRow';
import Campaign from '../../../ethereum/campaign';


class RequestIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestCount().call();
    const approversCount = await campaign.methods.approversCount().call();
    console.log(requestCount);

    const requests = await Promise.all(
      Array(parseInt(requestCount)).fill().map((element, index) => {
        return campaign.methods.requests(index).call()
      })
    )

    // console.log(requests);
    return { address, requests, requestCount, approversCount };
  }

  renderRow() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow 
          key={index}
          id={index}
          request={request}
          address={this.props.address}
          approversCount={this.props.approversCount}
        />
      );
    });
  }


  render() {
    const {Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <h3>
          Requests
        </h3>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary floated='right' style={{marginBottom: 10}}>加请求 </Button>
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>
                ID
              </HeaderCell>
              <HeaderCell>描述</HeaderCell>
              <HeaderCell>余额</HeaderCell>
              <HeaderCell>
                接受者
              </HeaderCell>
              <HeaderCell>
                批准计数
              </HeaderCell>
              <HeaderCell>
                批准
              </HeaderCell>
              <HeaderCell>
                最终确定 Finalize
              </HeaderCell>
            </Row>
          </Header>
          <Body>
            {this.renderRow()}
          </Body>
        </Table>
        <div>找到 {this.props.requestCount} 个请求</div>
      </Layout>
    );
  }
}

export default RequestIndex;