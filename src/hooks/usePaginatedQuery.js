import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Hook para búsqueda server-side + paginación con Supabase
 *
 * @param {Object} options
 * @param {Function} options.fetchFn - async ({ page, pageSize, search }) => { data, total }
 * @param {number}  options.pageSize - Items por página (default: 20)
 * @param {number}  options.searchDelay - Debounce en ms para búsqueda (default: 300)
 */
export function usePaginatedQuery({ fetchFn, pageSize = 20, searchDelay = 300 }) {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const timerRef = useRef(null)

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  // Reset a página 1 cuando cambia la búsqueda (con debounce)
  const debouncedSetSearch = useCallback((value) => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setSearch(value)
      setPage(1)
    }, searchDelay)
  }, [searchDelay])

  // Cleanup timer
  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchFn({ page, pageSize, search })
      .then((result) => {
        if (!cancelled) {
          setData(result.data)
          setTotal(result.total)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [page, pageSize, search, fetchFn])

  return {
    data,
    total,
    page,
    totalPages,
    setPage,
    loading,
    error,
    search,
    setSearch: debouncedSetSearch,
  }
}
