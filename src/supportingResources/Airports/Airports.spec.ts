import nock from 'nock'
import { Client } from '../../Client'
import { Airports } from './Airports'
import { mockAirport } from './mockAirport'

describe('airports', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  test('should get a single airport', async () => {
    nock(/(.*)/).get(`/air/airports/${mockAirport.id}`).reply(200, { data: mockAirport })

    const response = await new Airports(new Client({ token: 'mockToken' })).get(mockAirport.id)
    expect(response.data?.id).toBe(mockAirport.id)
  })

  test('should get all airports', async () => {
    nock(/(.*)/)
      .get(`/air/airports?limit=1`)
      .reply(200, { data: [mockAirport], meta: { limit: 1, before: null, after: null } })

    const response = new Airports(new Client({ token: 'mockToken' })).list({ queryParams: { limit: 1 } })
    for await (const page of response) {
      expect(page.data).toHaveLength(1)
      expect(page.data![0].id).toBe(mockAirport.id)
    }
  })
})
