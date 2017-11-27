const needle = require('needle');
const civicSip = require('../index');
const { assert } = require('chai');

const HEX_PRVKEY_NIST = 'd7b46dd4cf9fac3ec4e6cdba9571db4b1db1edca2656a21b75294f5f95990d7b';
// const HEX_PUBKEY_NIST = '047d9fd38a4d370d6cff16bf12723e343090d475bf36c1d806b625615a7873b0919f131e38418b0cd5b8a3e0a253fe3a958c7840bfc6be657af68062fecd7943d1';
const SECRET = '987e03c36bf94c0ac68d31d4404a565a';

describe('Civic SIP Server', function test() {
  this.timeout(10000);

  const API = 'https://kw9lj3a57c.execute-api.us-east-1.amazonaws.com/';
  const STAGE = 'dev';
  const authCode = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MTI4MTk1ZC0zMDkzLTRmM2MtYjYwNS1iMDU4YjE2Yzg1NWQiLCJpYXQiOjE1MTE3ODUzMTcuMDk5LCJleHAiOjE1MTE3ODcxMTcuMDk5LCJpc3MiOiJjaXZpYy1zaXAtaG9zdGVkLXNlcnZpY2UiLCJhdWQiOiJodHRwczovL2FwaS5jaXZpYy5jb20vc2lwLyIsInN1YiI6ImJiYjEyMyIsImRhdGEiOnsiY29kZVRva2VuIjoiZjkwYjYwNjUtZTBjNi00ZGRkLWIyY2UtODI5ZGEzYjdhNzgyIn19.0f32RalT0o5D7LmZptYGpTVI4sCljrz4KHy_-0gmQf6oXjkf3QOZiQCYU0aNv4r76HCm3vM_RZeyrxKfe8sMaw';

  const civicClient = civicSip.newClient({
    appId: 'bbb123',
    prvKey: HEX_PRVKEY_NIST,
    appSecret: SECRET,
    api: API,
    env: STAGE,
  });

  it('should call Civic with an invalid token and receive an error code.', (done) => {
    const doneFn = done;

    const BAD_AUTH_HEADER = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJqdGkiOiI1Y2QxY2RiMS05NWRkLTQ5MWYtODE4Mi1mZTdkNmE1NmEzZjciLCJpYXQiOjE0OTQ3MDU2NzAuNzYzLCJleHAiOjE0OTQ3MDU4NTAuNzYzLCJpc3MiOiJjaXZpYy1zaXAtaG9zdGVkLXNlcnZpY2UiLCJhdWQiOiJodHRwczovL2FwaS5jaXZpYy5jb20vc2lwLyIsInN1YiI6ImJiYjEyMyIsImRhdGEiOnsiY29kZVRva2VuIjoiNWVhNjkwN2EtMTQ0MS00NTIwLWFlYmItYjIwOTQ1NjYwM2I2In19.Ih5n-CuzbwcpfOFVY';
    const body = { authToken: authCode };
    const contentLength = Buffer.byteLength(JSON.stringify(body));
    const options = {
      headers: {
        'Content-Length': contentLength,
        Accept: '*/*',
        Authorization: BAD_AUTH_HEADER,
      },
    };

    let url = `${API + STAGE}/scopeRequest/authCode`;

    url = 'https://api.civic.com/sip/prod/scopeRequest/authCode';

    needle.post(url, body, options, (err, resp) => {
      if (err) {
        console.log('Error: ', JSON.stringify(err, null, 2));
        doneFn(err);
      } else {
        console.log('statusCode: ', resp.statusCode);
        console.log('statusMessage: ', resp.statusMessage);
        doneFn();
      }
    });
  });

  it('should exchange authCode for user data.', (done) => {
    const doneFn = done;

    civicClient.exchangeCode(authCode).then((data) => {
      console.log(data);
      doneFn();
    })
      .catch((error) => {
        doneFn(error);
      });
  });

  /*
  it.only('should exchange authCode for user data in async fashion.', async function(done) {
    const doneFn = done;

    try {
      const data = await civicClient.exchangeCode(authCode);
      console.log('response.data: ', JSON.stringify(data, null, 2));
      doneFn();
    } catch(error) {
      console.error(error.message);
    }

  });
  */
});

