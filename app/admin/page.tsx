'use client'

import BasicCard from '@/components/basic-card';
import RenderObject from '@/components/render-object';
import { Button } from '@/components/ui/button';
import { deployContract } from '@/lib/contract/deploy';
import { useEthersSigner } from '@/lib/get-signer';
import { getExplorerUrl, isEmpty } from '@/lib/utils';
import { siteConfig } from '@/util/site-config';
import { ReloadIcon } from '@radix-ui/react-icons';
import {useState, useEffect} from 'react';
import { Chain } from 'viem';
import { useChainId, useChains } from 'wagmi';


const AdminPage = () => {
    const [contract, setContract] = useState<any>({address: '0xa203Fa36a88c7CEDf35f5D4dE296641e738138E8'});
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const chainId = useChainId();
    const chains = useChains();
    const currentChain: Chain | undefined = (chains || []).find(
      (c) => c.id === chainId
    );

    const signer = useEthersSigner({ chainId });


    async function deployMasterContract () {
        setLoading(true);
        setError(null);


        try {
            // Deploy master contract
            const res = await deployContract(signer, currentChain?.name || 'ethereum');
            console.log('Master contract deployed:', res);
            setContract(res);
        } catch (error) {
            console.error('Error deploying master contract:', error);
            setError(JSON.stringify(error));
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="flex flex-row justify-center mt-8 max-w-[1000px]">

        <BasicCard title={`Deploy ${siteConfig.title} master contract`} className='w-full justify-center'>
{siteConfig.masterAddress && <p>Master contract address: {siteConfig.masterAddress}</p>
}
{!siteConfig.masterAddress && <p>Master contract address not set</p>}

            <div className='text-md my-4'>Deploy the master contract to the Theta blockchain.</div>

            <Button onClick={deployMasterContract} disabled={loading}>
                {loading &&
                    <span className="animate-spin">
                        <ReloadIcon />
                        </span>
                        }
                Deploy master contract
            </Button>

{error &&
                <div className='text-red-500'>{error}</div>}

            {contract?.address &&
                <div className='mt-4'>
                    <div className=' text-green-500'>Master contract deployed at: {contract?.address}</div>
                    <a href={getExplorerUrl(contract?.address, currentChain)} target="_blank" rel="noreferrer"
className='text-blue-500 mt-4 block text-sm hover:underline'
                    >
                        View contract on {currentChain?.name} explorer
                    </a>
                </div>
            }


        </BasicCard>


        </div>
    );
}

export default AdminPage;
