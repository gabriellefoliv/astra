import prisma from '../../lib/prisma'

interface UpdateProjectParams {
  projectId: string
  userId: string
  name: string
}

export async function updateProject({
  projectId,
  userId,
  name,
}: UpdateProjectParams) {
  const membership = await prisma.projectMember.findFirst({
    where: {
      projectId,
      userId,
      role: 'OWNER',
      status: 'ACCEPTED',
    },
  })

  if (!membership) {
    throw new Error('You are not allowed to update this project')
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

  const project = await prisma.project.update({
    where: { id: projectId },
    data: { name, slug },
  })

  return {
    id: project.id,
    name: project.name,
    slug: project.slug,
  }
}
