import { Gen, MResponse } from 'mduash'
import { Test } from '../../../common/Entity'
import { transactionAction } from '../../../plugin/sequelize'
import { Transaction } from 'sequelize'

// 新增
export async function saveTest(name: string, age: number) {
  await transactionAction(async (tran: Transaction) => {
    await Test.create(
      {
        id: Gen.guid(),
        name,
        age
      },
      { transaction: tran }
    )
  })
}

// 其他……

export default class TestService {
  // 测试分页
  static testPageList(query: any) {
    const { pageIndex, pageSize } = query

    const { getPageResult } = MResponse.getPageParams<number>({
      pageIndex,
      pageSize
    })

    return getPageResult([1, 2, 3], 20)
  }
}
