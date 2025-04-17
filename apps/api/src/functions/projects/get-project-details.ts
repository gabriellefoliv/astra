import prisma from '../../lib/prisma'

interface GetProjectDetailsParams {
  userId: string
  projectId: string
}

export async function getProjectDetails({
  userId,
  projectId,
}: GetProjectDetailsParams) {
  const membership = await prisma.projectMember.findFirst({
    where: {
      userId,
      projectId,
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

  if (!membership) {
    return null
  }

  const { project, role } = membership

  return {
    id: project.id,
    name: project.name,
    slug: project.slug,
    createdAt: project.createdAt,
    role,
    databases: project.databases.map(db => ({
      id: db.id,
      name: db.name,
      path: db.path,
      createdAt: db.createdAt,
      updatedAt: db.updatedAt,
    })),
  }
}
