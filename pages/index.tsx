import fs from 'fs'
import path from 'path'

import { useContext } from 'react'

import matter from 'gray-matter'
import type { NextPage } from 'next'
import getConfig from 'next/config'
import Head from 'next/head'
import { serialize } from 'next-mdx-remote/serialize'
import { IItemDocs, IGasDocs, IDocMeta } from 'types'

import { EthereumContext } from 'context/ethereumContext'

import HomeLayout from 'components/layouts/Home'
import ReferenceTable from 'components/Reference'
import { H1, Container, H3, Icon } from 'components/ui'

const { serverRuntimeConfig } = getConfig()

const HomePage = ({
  opcodeDocs,
  gasDocs,
}: {
  opcodeDocs: IItemDocs
  gasDocs: IGasDocs
}) => {
  const { opcodes } = useContext(EthereumContext)

  return (
    <>
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="EVM Codes - Opcodes" />
        <meta
          name="description"
          content="An Ethereum Virtual Machine Opcodes Interactive Reference"
        />
      </Head>
      {
        //<EvmStorageBanner />
      }
      <Container className="mt-4 mb-10 flex-col w-full text-center">
        <H1>zkEVM Type 5</H1>
        <H3 className="mb-4">
          zkEVM inspired by EVM, Good for learning, Not compatible with
          anything!
        </H3>
        <a>
          Made with love by{' '}
          <a
            className="underline"
            href="https://www.tetrationlab.com/"
            target="_blank"
          >
            Tetration Lab <Icon name="links-line" />
          </a>{' '}
          team!
        </a>
      </Container>

      <section className="py-10 md:py-20 bg-gray-50 dark:bg-black-700">
        <Container>
          <ReferenceTable
            reference={opcodes}
            itemDocs={opcodeDocs}
            gasDocs={gasDocs}
          />
        </Container>
      </section>
    </>
  )
}

HomePage.getLayout = function getLayout(page: NextPage) {
  return <HomeLayout>{page}</HomeLayout>
}

export const getStaticProps = async () => {
  const docsPath = path.join(serverRuntimeConfig.APP_ROOT, 'docs/opcodes')
  const docs = fs.readdirSync(docsPath)

  const opcodeDocs: IItemDocs = {}
  const gasDocs: IGasDocs = {}

  await Promise.all(
    docs.map(async (doc) => {
      const stat = fs.statSync(path.join(docsPath, doc))
      const opcode = path.parse(doc).name.toLowerCase()

      try {
        if (stat?.isDirectory()) {
          fs.readdirSync(path.join(docsPath, doc)).map((fileName) => {
            const markdown = fs.readFileSync(
              path.join(docsPath, doc, fileName),
              'utf-8',
            )
            const forkName = path.parse(fileName).name
            if (!(opcode in gasDocs)) {
              gasDocs[opcode] = {}
            }
            gasDocs[opcode][forkName] = markdown
          })
        } else {
          const markdownWithMeta = fs.readFileSync(
            path.join(docsPath, doc),
            'utf-8',
          )
          const { data, content } = matter(markdownWithMeta)
          const meta = data as IDocMeta
          const mdxSource = await serialize(content)

          opcodeDocs[opcode] = {
            meta,
            mdxSource,
          }
        }
      } catch (error) {
        console.debug("Couldn't read the Markdown doc for the opcode", error)
      }
    }),
  )
  return {
    props: {
      opcodeDocs,
      gasDocs,
    },
  }
}

export default HomePage
