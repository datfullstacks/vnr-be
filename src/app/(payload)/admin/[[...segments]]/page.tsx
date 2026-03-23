import config from '@payload-config'
import { importMap } from '@payload-importmap'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'

export const generateMetadata = async ({
  params,
  searchParams,
}: {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<Record<string, string | string[]>>
}) =>
  generatePageMetadata({
    config: Promise.resolve(config),
    params,
    searchParams,
  })

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<Record<string, string | string[]>>
}) =>
  RootPage({
    config: Promise.resolve(config),
    importMap,
    params,
    searchParams,
  })

export default Page
