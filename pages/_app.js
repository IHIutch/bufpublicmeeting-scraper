import { useState } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import {
  QueryClientProvider,
  QueryClient,
  Hydrate,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { extendTheme } from '@chakra-ui/react'
import { withProse } from '@nikolovlazar/chakra-ui-prose'
import { SSRProvider } from '@react-aria/ssr'

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient())

  const theme = extendTheme(withProse())
  return (
    <SSRProvider>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </Hydrate>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SSRProvider>
  )
}

export default MyApp
