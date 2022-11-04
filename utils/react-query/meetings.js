import { useQuery } from '@tanstack/react-query'
import axios from 'redaxios'
import qs from 'qs'

export const useGetMeetings = (params) => {
  const { isLoading, isError, isSuccess, isFetching, data, error } = useQuery(
    ['meetings', params],
    async () => {
      const { data } = await axios.get('/api/meetings', {
        params: qs.stringify(params),
      })
      return data
    },
    {
      keepPreviousData: true,
    }
  )
  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
    isFetching,
  }
}
