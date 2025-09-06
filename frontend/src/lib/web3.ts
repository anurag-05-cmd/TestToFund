import { ethers } from 'ethers';

export const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || '0x1fC39F5a1497C042A47054D94c6f473e39598853';

export const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)'
];

export async function getProvider() {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    return provider;
  }
  // fallback to public provider
  return ethers.getDefaultProvider();
}

export async function connectWallet() {
  const provider = await getProvider();
  if ((provider as any).send) await (provider as any).send('eth_requestAccounts', []);
  return provider;
}

export function formatUnits(value: ethers.BigNumber, decimals = 18) {
  return ethers.utils.formatUnits(value, decimals);
}
