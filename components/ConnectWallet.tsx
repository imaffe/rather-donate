'use client';

import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Button } from '@/components/ui/button';
import { injected, walletconnect } from '@/lib/web3/connectors';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ConnectWallet() {
  const { activate, deactivate, active, account, error } = useWeb3React();
  const [connecting, setConnecting] = useState(false);

  // Handle connection errors
  useEffect(() => {
    if (error) {
      console.error('Web3 Connection Error:', error);
      setConnecting(false);
    }
  }, [error]);

  // Attempt to reconnect on page load
  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem('isWalletConnected') === 'true') {
        try {
          await activate(injected);
        } catch (error) {
          console.error('Error on auto connect:', error);
        }
      }
    };
    connectWalletOnPageLoad();
  }, [activate]);

  const handleConnect = async (connector: any) => {
    try {
      setConnecting(true);
      await activate(connector);
      localStorage.setItem('isWalletConnected', 'true');
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      deactivate();
      localStorage.removeItem('isWalletConnected');
      
      // If using MetaMask, we can also disconnect from the site
      if ((window as any).ethereum) {

        
        await (window as any).ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });
      }
    } catch (error) {
      console.error('Error on disconnect:', error);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (active && account) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {formatAddress(account)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleDisconnect}>
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={connecting}>
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleConnect(injected)}>
          MetaMask
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleConnect(walletconnect)}>
          WalletConnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 