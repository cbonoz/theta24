import { useAccount } from 'wagmi';
import ConnectWallet from './wallet/connect-wallet'
import { SwitchNetwork } from './wallet/switch-network'

const NavHeader = () => {
    const { address } = {}

    const isAdmin = true || address === process.env.NEXT_PUBLIC_ADMIN_ADDRESS
    return (
        <header className="flex items-center h-16 bg-white-800 text-black px-4  border-b-4 border-gray-500 sticky top-0 z-50 bg-white">
            <div className="flex items-center">
                <a href="/" className="block">
                    <img
                        src="/logo.png"
                        alt="CreatorMatch Logo"
                        className="h-8 w-auto fill-current"
                    />
                </a>
                {/* <span className="ml-4 text-xl font-bold">CreatorMatch</span> */}
            </div>
            <nav className="flex">
                <a
                    href="/upload"
                    className="text-gray-500 hover:underline mx-4"
                >
                    Create creator page
                </a>
                |
                <a href="/creator" className="text-gray-500 hover:underline mx-4">
                    Find creator page
                </a>
                |
                <a href="/about" className="text-gray-500 hover:underline mx-4">
                    About
                </a>
                {isAdmin &&
                    <>
                        |
                        <a href="/admin" className="text-gray-500 hover:underline mx-4">

                            Admin
                            </a>
                            </>}
                {/* align right */}
            </nav>
            <span className="ml-auto align-right justify-end">
                <SwitchNetwork />
            </span>
            <span className="align-right justify-end">
                <ConnectWallet />
            </span>
        </header>
    )
}

export default NavHeader
