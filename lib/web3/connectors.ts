import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

const RPC_URLS = {
  1: 'https://mainnet.infura.io/v3/your-infura-id', // Replace with your Infura ID
  5: 'https://goerli.infura.io/v3/your-infura-id'   // Replace with your Infura ID
};

export const injected = new InjectedConnector({
  supportedChainIds: [1, 5] // Mainnet and Goerli
});

export const walletconnect = new WalletConnectConnector({
  rpc: RPC_URLS,
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true
}); 