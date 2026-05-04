import { utils } from './useAPI'
const { api } = utils

export const sendCampaign = async (payload) => {
  const response = await fetch(`${api}/campaign/dispatch`, {
    ...utils.options,
    method: 'POST',
    body: JSON.stringify(payload),
  })
  const data = await response.json()
  return data
}
