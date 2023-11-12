import { GITHUB_REPO_URL } from 'util/constants'

import { Container } from 'components/ui/Container'

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 dark:border-black-600 py-4">
      <Container>
        <div className="flex justify-between text-tiny text-gray-500 items-start">
          <div className="flex flex-col md:flex-row leading-6 gap-2">
            <span>
              Made by{' '}
              <a
                className="underline font-medium"
                href="https://tetrationlab.com"
                target="_blank"
                rel="noreferrer"
              >
                Tetration Lab
              </a>
            </span>
            <span>
              Original site by{' '}
              <a
                className="underline font-medium"
                href="https://smlxl.io"
                target="_blank"
                rel="noreferrer"
              >
                smlXL, Inc
              </a>{' '}
              and{' '}
              <a
                className="underline font-medium"
                href="https://www.evm.codes/"
                target="_blank"
                rel="noreferrer"
              >
                evm.codes
              </a>
              .
            </span>
          </div>

          <div>
            <a
              className="underline"
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
