const request = require('supertest')
const app = require('../dist/server').app
const { faker } = require('@faker-js/faker')
const User = require('../dist/models/user').default
const token = String(process.env.ACCESS_TOKEN)

describe('init tests', () => {
  it('check if server is running', async () => {
    const res = await request(app).get('/')

    expect(res.statusCode).toEqual(200)
  })
})

describe('clubs', () => {
  let user = {}

  const club = {
    name: faker.company.name(),
    email: faker.internet.email(),
    handle: faker.person.firstName()
  }

  beforeAll(async () => {
    try {
      user = await User.create({
        email: 'ramanjeet21085@iiitd.ac.in',
        name: 'Ramanjeet Singh',
        handle: 'raman',
        password: 'password',
        isClubsCoordinator: true
      })
    } catch (err) {
      user = User.findOne({ handle: 'raman' })
    }
    club.coordinator = user._id
  })

  it('fetch the list of all clubs', async () => {
    const res = await request(app).get('/clubs')

    expect(res.statusCode).toEqual(200)
  })

  it('create a new club', async () => {
    const res = await request(app)
      .post('/clubs')
      .set('Authorization', `Bearer ${token}`)
      .send(club)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('success')
  })

  it('return error if token not defined', async () => {
    const res = await request(app)
      .post('/clubs')
      .send(club)

    expect(res.statusCode).toEqual(401)
  })

  it('fetch club info', async () => {
    const res = await request(app)
      .get(`/clubs/${club.handle}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('name')
  })

  it('return error if token not defined', async () => {
    const res = await request(app)
      .get(`/clubs/${club.handle}`)

    expect(res.statusCode).toEqual(401)
  })

  it('edits club info', async () => {
    club.name = 'new name'
    const res = await request(app)
      .post(`/clubs/${club.handle}`)
      .send(club)

    expect(res.statusCode).toEqual(404)
  })

  it('approve club request', async () => {
    const res = await request(app)
      .post(`/clubs/requests/${club.handle}`)

    expect(res.statusCode).toEqual(404)
  })

  it('reject club request', async () => {
    const res = await request(app)
      .delete(`/clubs/requests/${club.handle}`)

    expect(res.statusCode).toEqual(404)
  })
})

describe('events', () => {
  let event = {
    name: faker.person.firstName(),
    handle: ''
  }

  it('fetch all events', async () => {
    const res = await request(app)
      .get('/events')

    expect(res.statusCode).toEqual(200)
  })

  it('create a request for an event', async () => {
    const res = await request(app)
      .post('/events/requests')
      .set('Authorization', `Bearer ${token}`)
      .send(event)

    event = res.body
    expect(res.statusCode).toEqual(200)
  })

  it('approve an event request', async () => {
    const res = await request(app)
      .post(`/events/requests/${event.handle}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
  })

  it('reject an event request', async () => {
    const res = await request(app)
      .delete(`/events/requests/${event.handle}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
  })

  it('fetch event info', async () => {
    const res = await request(app)
      .get(`/events/${event.handle}`)

    expect(res.statusCode).toEqual(200)
  })

  it('register for event', async () => {
    const res = await request(app)
      .post(`/events/${event.handle}/registrations`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
  })
})
