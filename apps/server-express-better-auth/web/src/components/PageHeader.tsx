import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description?: string
  backTo?: string
  showBack?: boolean
  actions?: React.ReactNode
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  backTo = '/home',
  showBack = true,
  actions,
}) => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(backTo)
  }

  return (
    <div>
      <div className="border-b bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                {description && (
                  <p className="text-sm text-gray-500 mt-1">{description}</p>
                )}
              </div>
            <div className="flex items-center gap-2">{actions}</div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {showBack && (
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-gray-900" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
            返回
          </Button>
        )}
      </div>
    </div>
  )
}

export default PageHeader