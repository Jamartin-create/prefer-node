import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import PageHeader from '@/components/PageHeader'

interface LoginHistory {
  id: string;
  userId: string;
  userAgent?: string;
  ipAddress?: string;
  city?: string;
  country?: string;
  createdAt: string;
}

const LoginHistoryPage: React.FC = () => {
  const { getLoginHistory, user } = useAuth()
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLoginHistory = async () => {
      try {
        const history = await getLoginHistory()
        setLoginHistory(history)
      } catch (error) {
        console.error('获取登录历史失败:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLoginHistory()
  }, [getLoginHistory])

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const getDeviceInfo = (userAgent: string) => {
    if (userAgent.includes('Mobile')) {
      return '移动端'
    } else if (userAgent.includes('Tablet')) {
      return '平板'
    } else {
      return '桌面端'
    }
  }

  const getLocation = (city: string, country: string) => {
    if (city && country) {
      return `${city}, ${country}`
    } else if (country) {
      return country
    } else if (city) {
      return city
    }
    return '未知位置'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader title="登录历史" description="查看您的账户登录记录" backTo="/home" />
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="登录历史" description="查看您的账户登录记录" backTo="/home" />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {loginHistory.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">暂无登录历史记录</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {loginHistory.map((record) => (
                <Card key={record.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {getDeviceInfo(record.userAgent)}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{formatDateTime(record.createdAt)}</p>
                            {record.id === loginHistory[0]?.id && (
                              <Badge variant="default" className="text-xs">
                                最近
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {getLocation(record.city, record.country)}
                          </p>
                          <p className="text-xs text-gray-500">
                            IP: {record.ipAddress}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {getDeviceInfo(record.userAgent)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>显示最近 {loginHistory.length} 次登录记录</p>
            <p>用户ID: {user?.id}</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginHistoryPage