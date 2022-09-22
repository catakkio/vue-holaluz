import { rest } from 'msw'

import * as clients from '../assets/clients.json';
import * as supplyPoints from '../assets/supply-points.json';

export default [
    rest.get('/clients', (req, res, ctx) => {
        return res(
            ctx.delay(50),
            ctx.json(clients)
        )
    }),
    rest.get('/supply-points', (req, res, ctx) => {
        return res(
            ctx.delay(50),
            ctx.json(supplyPoints)
        )
    })
]