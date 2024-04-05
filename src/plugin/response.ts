import { MResponse } from 'mduash'

const mRes = new MResponse({
  defaultErrorText: 'mduash-Error: something error ~',
  defaultSuccessText: 'mduash-Sussess: success ~'
})

export const SuccessRes = mRes.success
export const ErrorRes = mRes.error
