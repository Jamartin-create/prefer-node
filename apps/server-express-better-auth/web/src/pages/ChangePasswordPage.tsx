import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import PageHeader from '@/components/PageHeader'

const ChangePasswordPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { changePassword } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast({
        title: '错误',
        description: '新密码与确认密码不匹配',
        variant: 'destructive',
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: '错误',
        description: '新密码长度至少为6位',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      await changePassword(currentPassword, newPassword)
      toast({
        title: '成功',
        description: '密码修改成功，请重新登录',
      })
      navigate('/home')
    } catch (error) {
      toast({
        title: '修改密码失败',
        description: error instanceof Error ? error.message : '请检查当前密码是否正确',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="修改密码" description="更新您的账户密码" backTo="/home" />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>修改密码</CardTitle>
                <CardDescription>
                  请输入您的当前密码和新密码
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">当前密码</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="请输入当前密码"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">新密码</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="请输入新密码（至少6位）"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">确认新密码</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="请再次输入新密码"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? '修改中...' : '修改密码'}
                  </Button>
                </form>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-gray-500 text-center w-full">
                  修改密码后，您需要使用新密码重新登录
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ChangePasswordPage