import api from '@/Utils/api'
import _isEmpty from 'lodash/isEmpty'

const mapItems = (data: any): any => data
const onQuerys = (data: any = {}, params: any = {}): any => ({
  ...data,
  ...params
})
const onResponse = (): void => {}
const onError = (e: string): void => {
  console.error(e)
}

interface PageParams {
  mapItem?: typeof mapItems
  url: string
  onQuery?: typeof onQuerys
  onRes?: typeof onResponse
  onErr?: (error: string) => void
}
function init() {
  this.list = []
  this.loading = false
  this.page = 1
  this.hasMore = true
  this.error = ''
}
async function getData(params) {
  const { loading, page, hasMore, url, mapItem } = this
  if (loading || !hasMore) {
    return
  }
  this.loading = true
  try {
    // 请求开始钩子，处理query
    const query = this.onQuery({ page }, params)
    const data = await api[url](query)

    if (!data) {
      return
    }
    const { current_page, last_page } = data
    if (data && data.data && current_page <= last_page) {
      const mapData = data.data.map(item => mapItem(item))
      this.list = [...this.list, ...mapData]
      this.page = current_page
    }
    if (current_page < last_page) {
      this.page = current_page + 1
    } else {
      this.hasMore = false
    }
    this.isEmpty = _isEmpty(this.list)
    // on response 钩子，可以处理整个this
    this.onRes()
  } catch (error) {
    this.onError(error)
    console.error(error)
    this.error = error
  }
  this.loading = false
}
class PaginationStore {
  constructor({ mapItem, url, onQuery, onRes, onErr }: PageParams) {
    this.url = url
    // mobx 要比对Object的原型和输入进去的object的原型，不一致会报错，hack一下
    if (mapItem) {
      this.mapItem = mapItem
    }
    if (onQuery) {
      this.onQuery = onQuery
    } else {
      this.onQuery = onQuerys
    }
    if (onRes) {
      this.onRes = onRes
    } else {
      this.onRes = onResponse
    }
    if (onErr) {
      this.onError = onErr
    }
    this.init = init
    this.getData = getData
  }
  url = ''
  page = 1
  list: any[] = []
  loading = false
  hasMore = true
  error = ''
  isEmpty = false
  mapItem = mapItems
  onQuery = onQuerys
  onRes = onResponse
  onError = onError
  init = init
  getData = getData
}

export default PaginationStore
