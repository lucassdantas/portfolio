import { Button } from '@/components/Button'
import { useLanguage } from '@/contexts/LanguageContext'
import { Project } from '@/types/projectType'
import React from 'react'

export const CardBody = ({project}:{project:Project}) => {
  const { t } = useLanguage()
  return (
    <>
      <div className="text-left p-4 text-base_1-a0">
        <h3 className="text-xl font-bold">{project.name}</h3>
        <p >{project.description}</p>
      </div>

      <div className="flex justify-center gap-4 pb-4">
        {project.liveProjectUrl && (
          <Button>
            <a href={project.liveProjectUrl} target="_blank">{t('projects.deploy')}</a>
          </Button>
        )}
        {project.repositoryUrl && (
          <Button>
            <a href={project.repositoryUrl} target="_blank">{t('projects.github')}</a>
          </Button>
        )}
      </div>
    </>
  )
}
