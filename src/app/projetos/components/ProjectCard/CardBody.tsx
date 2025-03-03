import { Button } from '@/components/Button'
import { Project } from '@/types/projectType'
import React from 'react'

export const CardBody = ({project}:{project:Project}) => {
  return (
    <>
      <div className="text-center p-4 text-base_1-a0">
        <h3 className="text-xl font-bold">{project.name}</h3>
        <p >{project.description}</p>
      </div>

      <div className="flex justify-center gap-4 pb-4">
        {project.liveProjectUrl && (
          <Button>
            <a href={project.liveProjectUrl} target="_blank">Deploy</a>
          </Button>
        )}
        {project.repositoryUrl && (
          <Button>
            <a href={project.repositoryUrl} target="_blank">GitHub</a>
          </Button>
        )}
      </div>
    </>
  )
}
