'use client'

import BasicCard from '@/components/basic-card';
import RenderObject from '@/components/render-object';
import { Button } from '@/components/ui/button';
import { deployContract } from '@/lib/contract/deploy';
import { useEthersSigner } from '@/lib/get-signer';
import { isEmpty } from '@/lib/utils';
import { ReloadIcon } from '@radix-ui/react-icons';
import {useState, useEffect} from 'react';
import { Chain } from 'viem';
import { useChainId, useChains } from 'wagmi';


const AdminPage = () => {
    const [contract, setContract] = useState<any>({});
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
        <div className='space-y-4'>

        <BasicCard title="Deploy master contract">
            <p>Deploy the master contract to the Theta blockchain.</p>


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

            {!isEmpty(contract) &&
                <div>
                    <RenderObject obj={contract as any} title="Master contract deployed" />
                </div>
            }


        </BasicCard>


        </div>
    );
}

export default AdminPage;
