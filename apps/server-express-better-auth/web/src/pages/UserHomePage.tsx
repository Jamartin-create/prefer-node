import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, LogOut } from 'lucide-react'

const UserHomePage: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">用户中心</h1>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              退出登录
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">欢迎回来，{user.name}！</h2>
            
            <div className="space-y-6">
              {/* User Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    用户信息
                  </CardTitle>
                  <CardDescription>您的账户详细信息</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">用户ID</label>
                      <p className="text-sm text-gray-900 mt-1">{user.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">用户名</label>
                      <p className="text-sm text-gray-900 mt-1">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">注册时间</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">邮箱验证</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {user.emailVerified ? '已验证' : '未验证'}
                      </p>
                    </div>
                  </div>
                  {user.email && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">邮箱地址</label>
                      <p className="text-sm text-gray-900 mt-1">{user.email}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions Card */}
              <Card>
                <CardHeader>
                  <CardTitle>快速操作</CardTitle>
                  <CardDescription>管理您的账户</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      修改密码
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      更新个人信息
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      查看登录历史
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UserHomePage