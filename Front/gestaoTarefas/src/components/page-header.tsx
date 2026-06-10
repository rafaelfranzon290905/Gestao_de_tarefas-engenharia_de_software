import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"

interface PageHeaderProps {
  title: string
  subtitle?: React.ReactNode
  buttons?: React.ReactNode
  tabs?: { name: string; icon: any }[]
  activeTab?: string
  onTabChange?: (tabName: string) => void
}

export function PageHeader({
  title,
  subtitle,
  buttons,
  tabs,
  activeTab,
  onTabChange,
}: PageHeaderProps) {
  return (
    <header className="flex w-full flex-col px-4 pt-4">
      <div className="flex flex-row items-center">
        <div>
          <h1 className="text-title text-2xl font-bold tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {/* Lado Direito: Botões e Ações (passados como children) */}
        <div className="ml-auto flex items-center gap-1.5 p-2">{buttons && (buttons)}</div>
      </div>
      {tabs && activeTab ? (
        <div className="flex flex-row items-center gap-2 mt-1.5" >
          <Tabs value={activeTab} onValueChange={(e) => onTabChange?.(e)}>
            <TabsList variant="line">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger key={tab.name} value={tab.name}>
                    <Icon /> {tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </div>
      ) : null}
    </header>
  )
}
