import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import PageHeader from '@/components/PageHeader'

interface LinkedAccount {
  provider: string
  providerAccountId: string
  linkedAt?: string
}

const providers: Array<'github' | 'google'> = ['github', 'google']

const ProviderLabel: Record<'github' | 'google', string> = {
  github: 'GitHub',
  google: 'Google',
}

const AccountLinkingPage: React.FC = () => {
  const { getLinkedAccounts, linkAccount, unlinkAccount } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [accounts, setAccounts] = useState<LinkedAccount[]>([])

  const refresh = async () => {
    setLoading(true)
    try {
      const data = await getLinkedAccounts()
      setAccounts(data)
    } catch (error) {
      toast({
        title: '获取绑定状态失败',
        description: error instanceof Error ? error.message : '请稍后重试',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const isLinked = (providerId: 'github' | 'google') =>
    accounts.some((a) => a.providerId === providerId)

  const handleLink = async (provider: 'github' | 'google') => {
    try {
      await linkAccount(provider)
      // linkAccount 会重定向到提供商授权，成功后回到此页
    } catch (error) {
      toast({
        title: '发起绑定失败',
        description: error instanceof Error ? error.message : '请稍后重试',
        variant: 'destructive',
      })
    }
  }

  const handleUnlink = async (provider: 'github' | 'google') => {
    try {
      await unlinkAccount(provider)
      toast({ title: '解绑成功', description: `${ProviderLabel[provider]} 已解绑` })
      refresh()
    } catch (error) {
      toast({
        title: '解绑失败',
        description: error instanceof Error ? error.message : '请稍后重试',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="账号绑定管理" description="查看并管理您的第三方账号" backTo="/home" />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>绑定状态</CardTitle>
                <CardDescription>查看并管理您的第三方账号</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {providers.map((p) => (
                    <div key={p} className="flex items-center justify-between border rounded-md p-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{ProviderLabel[p]}</div>
                        <div className="text-xs text-gray-500">
                          {loading
                            ? '加载中...'
                            : isLinked(p)
                            ? `已绑定（账号ID：${accounts.find((a) => a.provider === p)?.providerAccountId || ''}）`
                            : '未绑定'}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!isLinked(p) ? (
                          <Button variant="outline" onClick={() => handleLink(p)}>
                            绑定
                          </Button>
                        ) : (
                          <Button variant="destructive" onClick={() => handleUnlink(p)}>
                            解绑
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AccountLinkingPage
