import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient()

async function index(request, response){
  const allTasks = await prisma.tasksList.findMany()
                                          .catch((e) => { throw e })
                                          .finally(async ()=> { await prisma.$disconnect })
  return response.status(200).json(allTasks)                                        
}

async function createTask(request, response){
  const { taskDescription, status } = request.body

  const task = await prisma.tasksList.create({
    data: {
      taskDescription,
      status
    }
  }).catch((e) => { throw e})
    .finally( async () => { await prisma.$disconnect })

  return response.status(200).json(task)
}

async function completeTask(request, response){
  const id = request.params.id

  const task = await prisma.tasksList.findUnique({
    where: {
      id: parseInt(id),
    },
  })  

  await prisma.tasksList.update({
    where: { id: parseInt(id) },
    data: {
      status: (task.status == 'Pendente' ? 'Completa' : 'Pendente')
    }
  })

  return response.status(200).json(task)
  
}

export { index, createTask, completeTask}