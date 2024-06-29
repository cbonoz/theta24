export const config = {
    title: 'CreatorMatch',
    description:
        'A smart contract mediated marketplace connecting creators with sponsors',
    isLocal: process.env.NEXT_PUBLIC_ENV === 'development',
    admin: {
        information: 'The admin page contains information for managing creator and sponsor interactions.'
    },
    about: [
        {
            title: 'What is CreatorMatch?',
            description:
                'CreatorMatch connects content creators with sponsors using Theta blockchain technology to ensure secure and transparent collaborations.',
        },
        {
            title: 'How does it work?',
            description:
                'Creators can post their project ideas and sponsors can browse through these projects to find ones they want to support. Smart contracts manage the agreements and fund transfers, ensuring all parties meet their obligations.',
        },
        {
            title: 'Disclaimer',
            description:
                'CreatorMatch is currently a proof of concept prototype and is provided as-is without any guarantees. Use at your own discretion.',
        },
    ],
    steps: [
        {
            title: 'Create',
            description:
                'Creators post their project ideas, specifying the type of content and required sponsorship.',
        },
        {
            title: 'Connect',
            description:
                'Sponsors browse projects and connect with creators whose ideas they want to support. Agreements are managed through smart contracts.',
        },
        {
            title: 'Collaborate',
            description:
                'Creators and sponsors collaborate to bring the project to life. Smart contracts ensure that funds are released only when agreed milestones are met.',
        },
    ],
}
