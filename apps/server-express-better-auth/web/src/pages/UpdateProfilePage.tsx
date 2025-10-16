import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import PageHeader from '@/components/PageHeader'

const UpdateProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast({
        title: '错误',
        description: '用户名不能为空',
        variant: 'destructive',
      })
      return
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: '错误',
        description: '请输入有效的邮箱地址',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      await updateUser({ name: name.trim(), email: email.trim() || undefined })
      toast({
        title: '成功',
        description: '个人信息更新成功',
      })
    } catch (error) {
      toast({
        title: '更新失败',
        description: error instanceof Error ? error.message : '更新个人信息失败，请重试',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="更新个人信息" description="更新您的账户基本信息" backTo="/home" />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>更新个人信息</CardTitle>
                <CardDescription>
                  更新您的用户名和邮箱地址
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">用户名 *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="请输入用户名"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱地址</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="请输入邮箱地址（可选）"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? '更新中...' : '更新信息'}
                  </Button>
                </form>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-gray-500 space-y-1 w-full">
                  <p>• 用户名为必填项</p>
                  <p>• 邮箱地址为可选项，但需要验证</p>
                  <p>• 用户ID: {user.id}</p>
                  <p>• 注册时间: {new Date(user.createdAt).toLocaleDateString('zh-CN')}</p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UpdateProfilePage