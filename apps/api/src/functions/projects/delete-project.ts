import prisma from '../../lib/prisma'

interface DeleteProjectParams {
  projectId: string
  userId: string
}

export async function deleteProject({
  projectId,
  userId,
}: DeleteProjectParams) {
  const membership = await prisma.projectMember.findFirst({
    where: {
      projectId,
      userId,
      role: 'OWNER',
      status: 'ACCEPTED',
    },
  })

  if (!membership) {
    throw new Error('Project not found or user is not the owner')
  }

  await prisma.database.deleteMany({
    where: {
      projectId,
    },
  })

  await prisma.projectMember.deleteMany({
    where: {
      projectId,
    },
  })

  await prisma.project.delete({
    where: {
      id: projectId,
    },
  })

  return { success: true }
}
