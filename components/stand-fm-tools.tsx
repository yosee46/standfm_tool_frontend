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
import { ThumbsUp, ChevronDown, Settings, Play, Plus, Trash, Eye, EyeOff, LogOut, Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { useAuth } from "@/hooks/useAuth";

export function StandFmToolsComponent() {
  const { user, userId, signOut, isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('auto-like')
  const [isEnabled, setIsEnabled] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [maxLikes, setMaxLikes] = useState(100)
  const [keywords, setKeywords] = useState('')
  const [showAllHistory, setShowAllHistory] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSettingMaxLikes, setIsSettingMaxLikes] = useState(false)
  const { toast } = useToast()
  const [executionHistory, setExecutionHistory] = useState([]);

  const [replySteps, setReplySteps] = useState([
    { trigger: '', response: '' }
  ])


  useEffect(() => {
    if (user && userId) {
      const fetchSettings = async () => {
        try {
          const response = await fetch(`/api/get-setting?id=${userId}`);
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
    }
  }, [user, userId]);

  useEffect(() => {
    if (userId) {
      fetchAutoLikeSettings();
      fetchExecutionHistory();
      setIsLoading(false);
    }
  }, [userId]);

  const fetchExecutionHistory = async () => {
    try {
      const response = await fetch(`/api/auto-like/executions?userId=${userId}`);
      const data = await response.json();
      setExecutionHistory(data);
    } catch (error) {
      console.error('実行履歴の取得に失敗しました:', error);
      toast({
        title: "エラー",
        description: "実行履歴の取得に失敗しました。",
        variant: "destructive",
      });
    }
  };

  const fetchAutoLikeSettings = async () => {
    try {
      const response = await fetch(`/api/auto-like/settings?userId=${userId}`)
      const data = await response.json()
      setIsEnabled(data.isEnabled)
      setMaxLikes(data.maxLikes)
      setKeywords(data.keywords)
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
      const response = await fetch(`/api/save-setting?id=${userId}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
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

  const handleSettingsSave = async () => {
    setIsSettingMaxLikes(true)
    try {
      await fetch(`/api/auto-like/settings?userId=${userId}&maxLikes=${maxLikes}&keywords=${encodeURIComponent(keywords)}`, {
        method: 'POST',
      })
      toast({
        title: "設定を保存しました",
        description: "最大いいね数とキーワードが更新されました。",
      })
    } catch (error) {
      console.error('設定の保存に失敗しました:', error)
      toast({
        title: "エラー",
        description: "設定の保存に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSettingMaxLikes(false)
    }
  }

  const displayedHistory = showAllHistory ? executionHistory : executionHistory.slice(0, 3)

  return (
    <div className="flex h-screen bg-gray-100">
      {isAuthLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : user ? (
        isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
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
                  自動いいね
                </Button>
                {/* <Button
                  variant={activeTab === 'auto-reply' ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    activeTab === 'auto-reply' ? 'text-white' : 'text-gray-900 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('auto-reply')}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  自動返信
                </Button> */}
                <Button
                  variant={activeTab === 'settings' ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    activeTab === 'settings' ? 'text-white' : 'text-gray-900 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  アカウント設定
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-900 hover:text-gray-900 hover:bg-gray-100"
                  onClick={signOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  ログアウト
                </Button>
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
              <Card className="max-w-3xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-gray-900">
                    {activeTab === 'auto-like' ? '自動いいね' : 
                     activeTab === 'auto-reply' ? '自動返信' : '設定'}
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
                        <Label htmlFor="auto-like" className="text-lg font-medium text-gray-900">自動いいねを有効にする</Label>
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
                        <Input
                          id="max-likes"
                          type="number"
                          min={1}
                          value={maxLikes}
                          onChange={(e) => setMaxLikes(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="keywords" className="text-sm font-medium text-gray-900">
                          キーワード（カンマ区切り）
                        </Label>
                        <Input
                          id="keywords"
                          value={keywords}
                          onChange={(e) => setKeywords(e.target.value)}
                          className="w-full"
                          placeholder="例: 音楽,ラジオ,トーク"
                        />
                        <div className="mt-2 p-3 bg-blue-50 rounded-md border border-blue-200">
                          <h4 className="text-sm font-semibold text-blue-700 mb-1">キーワードとは</h4>
                          <p className="text-sm text-blue-600">
                            入力されたキーワードを元に、ハッシュタグを検索し、そのハッシュタグの最新の投稿を順番にいいねしていきます。複数のキーワードを入力することで、より幅広い投稿にいいねすることができます。
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          onClick={handleSettingsSave}
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

                      <Separator className="my-4" />

                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">実行履歴</h3>
                        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                          <ul className="space-y-2">
                            {displayedHistory.map((execution, index) => (
                              <li key={index} className="flex items-center justify-between text-sm bg-gray-100 rounded-md p-2">
                                <span className="flex items-center text-gray-900">
                                  <Play className="w-3 h-3 mr-2" />
                                  {new Date(new Date(execution.startTime).getTime() - 9 * 60 * 60 * 1000).toLocaleDateString('ja-JP')}
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
          </>
        )
      ) : (
        <main className="flex-1 p-8 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">ログイン</CardTitle>
              <CardDescription className="text-center">
                サービスを利用するにはログインが必要です。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GoogleSignInButton />
            </CardContent>
          </Card>
        </main>
      )}
    </div>
  )
}