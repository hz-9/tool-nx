import { defaultCompare } from '../index'

describe('Compare function', () => {
  it('compare - base', async () => {
    const arr = [1, 3, 2]
    arr.sort()
    expect(arr).toEqual([1, 2, 3])
  })
  it('compare - 2', async () => {
    const arr = [1, 3, 2]
    arr.sort(defaultCompare)
    expect(arr).toEqual([1, 2, 3])
  })
})
