import { useRouter } from 'next/router'

import { GITHUB_REPO_URL, TURING_ZERO_URL } from 'util/constants'

import { Icon } from 'components/ui'

const useActions = () => {
  const router = useRouter()

  return [
    {
      id: 'opcodes',
      name: 'Opcodes',
      shortcut: ['o'],
      keywords: 'home opcodes back',
      section: 'Navigation',
      perform: () => router.push('/'),
      subtitle: 'Opcodes reference',
      icon: <Icon name="home-2-line" />,
    },
    {
      id: 'playground',
      name: 'Playground',
      shortcut: ['p'],
      keywords: 'editor play',
      section: 'Navigation',
      perform: () => router.push('/playground'),
      subtitle: 'Play with EVM in real-time',
      icon: <Icon name="play-circle-line" />,
    },
    {
      id: 'turing',
      name: 'Turing Zero',
      shortcut: ['t'],
      keywords: 'turing zero',
      section: 'Navigation',
      subtitle: 'Turing Zero zmVM',
      perform: () => window.open(TURING_ZERO_URL, '_blank'),
      icon: <Icon name="information-line" />,
    },
    {
      id: 'github',
      name: 'GitHub',
      shortcut: ['g'],
      keywords: 'contribute GitHub issues',
      section: 'Navigation',
      subtitle: 'Contribute on GitHub',
      perform: () => window.open(GITHUB_REPO_URL, '_blank'),
      icon: <Icon name="github-fill" />,
    },
  ]
}

export default useActions
