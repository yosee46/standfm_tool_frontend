'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThumbsUp, ChevronDown, Settings, Play, MessageSquare, Plus, Trash, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export function StandFmToolsComponent() {
  const [activeTab, setActiveTab] = useState('auto-like')
  const [isEnabled, setIsEnabled] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [maxLikes, setMaxLikes] = useState(100)
  const [showAllHistory, setShowAllHistory] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSettingMaxLikes, setIsSettingMaxLikes] = useState(false)
  const { toast } = useToast()
  const [executionHistory] = useState([
    { startTime: "2023-06-10 15:30:00", likes: 50 },
    { startTime: "2023-06-10 14:00:00", likes: 30 },
    { startTime: "2023-06-10 12:30:00", likes: 20 },
    { startTime: "2023-06-09 18:45:00", likes: 40 },
    { startTime: "2023-06-09 10:15:00", likes: 25 },
  ])

  const [replySteps, setReplySteps] = useState([
    { trigger: '', response: '' }
  ])

  const [userId] = useState('ca36uxngr') // 仮のユーザーID

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/get-setting?id=ca36uxngr');
        const data = await response.json();
        if (data.user) {
          setUsername(data.user.user_name);
          setPassword(data.user.password);
        }
      } catch (error) {
        console.error('設定の取得中にエラーが発生しました:', error);
        toast({
          title: "エラー",
          description: "設定の取得中にエラーが発生しました。",
          variant: "destructive",
        });
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    fetchAutoLikeSettings()
  }, [])

  const fetchAutoLikeSettings = async () => {
    try {
      const response = await fetch(`/api/auto-like/settings?userId=${userId}`)
      const data = await response.json()
      setIsEnabled(data.isEnabled)
      setMaxLikes(data.maxLikes)
    } catch (error) {
      console.error('自動いいね設定の取得に失敗しました:', error)
      toast({
        title: "エラー",
        description: "自動いいね設定の取得に失敗しました。",
        variant: "destructive",
      })
    }
  }

  const addReplyStep = () => {
    setReplySteps([...replySteps, { trigger: '', response: '' }])
  }

  const removeReplyStep = (index) => {
    setReplySteps(replySteps.filter((_, i) => i !== index))
  }

  const updateReplyStep = (index, field, value) => {
    const newSteps = [...replySteps]
    newSteps[index][field] = value
    setReplySteps(newSteps)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/save-setting?id=ca36uxngr&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
        method: 'POST',
      });
      const data = await response.json();
      console.log('設定が保存されました:', data);
      toast({
        title: "設定を保存しました",
        description: "変更が正常に保存されました。",
      })
    } catch (error) {
      console.error('エラーが発生しました:', error);
      toast({
        title: "エラー",
        description: "設定の保存中にエラーが発生しました。",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAutoLikeToggle = async () => {
    setIsToggling(true)
    try {
      const response = await fetch(`/api/auto-like/toggle?userId=${userId}&isEnabled=${!isEnabled}`, {
        method: 'POST',
      })
      const data = await response.json()
      setIsEnabled(data.isEnabled)
      toast({
        title: data.isEnabled ? "自動いいねを有効化しました" : "自動いいねを無効化しました",
        description: data.isEnabled ? "自動いいね機能が開始されました。" : "自動いいね機能がオフになりました。",
      })
    } catch (error) {
      console.error('自動いいねの切り替えに失敗しました:', error)
      toast({
        title: "エラー",
        description: "自動いいねの切り替えに失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsToggling(false)
    }
  }

  const handleMaxLikesChange = async (value: number) => {
    setIsSettingMaxLikes(true)
    try {
      await fetch(`/api/auto-like/max-likes?userId=${userId}&maxLikes=${value}`, {
        method: 'POST',
      })
      setMaxLikes(value)
      toast({
        title: "設定を保存しました",
        description: "最大いいね数が更新されました。",
      })
    } catch (error) {
      console.error('最大いいね数の設定に失敗しました:', error)
      toast({
        title: "エラー",
        description: "最大いいね数の設定に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSettingMaxLikes(false)
    }
  }

  const displayedHistory = showAllHistory ? executionHistory : executionHistory.slice(0, 3)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Side Menu */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">stand.fm ツール</h1>
        <nav className="space-y-2">
          <Button
            variant={activeTab === 'auto-like' ? 'default' : 'ghost'}
            className={`w-full justify-start ${
              activeTab === 'auto-like' ? 'text-white' : 'text-gray-900 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('auto-like')}
          >
            <ThumbsUp className="mr-2 h-4 w-4" />
            自動いいねツール
          </Button>
          <Button
            variant={activeTab === 'auto-reply' ? 'default' : 'ghost'}
            className={`w-full justify-start ${
              activeTab === 'auto-reply' ? 'text-white' : 'text-gray-900 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('auto-reply')}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            自動返信設定
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'default' : 'ghost'}
            className={`w-full justify-start ${
              activeTab === 'settings' ? 'text-white' : 'text-gray-900 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            設定
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              {activeTab === 'auto-like' ? '自動いいねツール' : 
               activeTab === 'auto-reply' ? '自動返信設定' : '設定'}
            </CardTitle>
            <CardDescription>
              {activeTab === 'auto-like' ? 'お気に入りの配信者を効率的にサポート' : 
               activeTab === 'auto-reply' ? 'ステップ別の自動返信を設定します' : 
               'アカウント情報を設定します。'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeTab === 'auto-like' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-like" className="text-lg font-medium text-gray-900">自動いいね</Label>
                  <div className="flex items-center space-x-2">
                    {isToggling && (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    )}
                    <Switch
                      id="auto-like"
                      checked={isEnabled}
                      onCheckedChange={handleAutoLikeToggle}
                      disabled={isToggling}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-likes" className="text-sm font-medium text-gray-900">
                    最大いいね数
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="max-likes"
                      type="number"
                      min={1}
                      value={maxLikes}
                      onChange={(e) => setMaxLikes(Number(e.target.value))}
                      className="w-full"
                    />
                    <Button
                      onClick={() => handleMaxLikesChange(maxLikes)}
                      className="whitespace-nowrap"
                    >
                      {isSettingMaxLikes ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          保存中...
                        </>
                      ) : (
                        '設定を保存'
                      )}
                    </Button>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">実行履歴</h3>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <ul className="space-y-2">
                      {displayedHistory.map((execution, index) => (
                        <li key={index} className="flex items-center justify-between text-sm bg-gray-100 rounded-md p-2">
                          <span className="flex items-center text-gray-900">
                            <Play className="w-3 h-3 mr-2" />
                            {execution.startTime}
                          </span>
                          <span className="font-medium text-gray-900">
                            {execution.likes} いいね
                          </span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                  {executionHistory.length > 3 && (
                    <Button
                      variant="ghost"
                      className="w-full text-sm text-gray-900 hover:text-gray-900"
                      onClick={() => setShowAllHistory(!showAllHistory)}
                    >
                      {showAllHistory ? "履歴を閉じる" : "さらに表示"}
                      <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${showAllHistory ? 'rotate-180' : ''}`} />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'auto-reply' && (
              <div className="space-y-4">
                {replySteps.map((step, index) => (
                  <Card key={index} className="bg-gray-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-900">ステップ {index + 1}</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => removeReplyStep(index)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <Label htmlFor={`trigger-${index}`} className="text-gray-900">トリガー</Label>
                        <Input
                          id={`trigger-${index}`}
                          value={step.trigger}
                          onChange={(e) => updateReplyStep(index, 'trigger', e.target.value)}
                          placeholder="例: こんにちは"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`response-${index}`} className="text-gray-900">返信</Label>
                        <Textarea
                          id={`response-${index}`}
                          value={step.response}
                          onChange={(e) => updateReplyStep(index, 'response', e.target.value)}
                          placeholder="例: こんにちは！お元気ですか？"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button onClick={addReplyStep} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  ステップを追加
                </Button>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">StandFMアカウント</h3>
                  <div className="space-y-4 pl-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium text-gray-900">
                        ユーザー名
                      </Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full"
                        placeholder="ユーザー名を入力してください"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-900">
                        パスワード
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pr-10"
                          placeholder="パスワードを入力してください"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" aria-hidden="true" />
                          ) : (
                            <Eye className="h-5 w-5" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            {(activeTab === 'auto-reply' || activeTab === 'settings') && (
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Settings className="mr-2 h-4 w-4" />
                    設定を保存
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}