import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { getUserId } from '../utils/getUserId'

interface TeamBody {
	name: string
	members: string[]
}

export async function teams(app: FastifyInstance) {
	app.get('/teams/me', async (request, reply) => {
		const userId = await getUserId(request)

		const team = await prisma.team.findFirst({
			where: {
				leaderId: userId,
			},
			select: {
				id: true,
				name: true,
				members: true,
			},
		})

		reply.send(team)
	})

	app.put('/teams/me', async (request, reply) => {
		const userId = await getUserId(request)

		const { name, members } = request.body as TeamBody

		try {
			await prisma.team.update({
				where: {
					leaderId: userId,
				},
				data: {
					name,
					members,
				},
			})
		} catch (error) {
			reply.code(400).send({ message: 'Team not found' })
		}

		reply.send({ message: 'Team updated' })
	})

	app.get('/teams', async (_, reply) => {
		const teams = await prisma.team.findMany()

		reply.send(teams)
	})
}
