import prisma from '../../lib/prisma'

interface CreateProjectParams {
  name: string
  userId: string
}

export async function createProject({ name, userId }: CreateProjectParams) {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const result = await prisma.$transaction(async tx => {
    const project = await tx.project.create({
      data: {
        name,
        slug,
      },
    })

    await tx.projectMember.create({
      data: {
        userId,
        projectId: project.id,
        role: 'OWNER',
        status: 'ACCEPTED',
        joinedAt: new Date(),
      },
    })

    return project
  })

  return result
}
