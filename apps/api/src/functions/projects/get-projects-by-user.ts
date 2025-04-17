import prisma from '../../lib/prisma'

interface GetProjectsByUserParams {
  userId: string
}

export async function getProjectsByUser({ userId }: GetProjectsByUserParams) {
  const projects = await prisma.projectMember.findMany({
    where: {
      userId,
      status: 'ACCEPTED',
    },
    include: {
      project: {
        include: {
          databases: true,
        },
      },
    },
  })

  return projects.map(pm => ({
    id: pm.project.id,
    name: pm.project.name,
    slug: pm.project.slug,
    createdAt: pm.project.createdAt,
    role: pm.role,
    databases: pm.project.databases.map(db => ({
      id: db.id,
      name: db.name,
      path: db.path,
      createdAt: db.createdAt,
      updatedAt: db.updatedAt,
    })),
  }))
}
