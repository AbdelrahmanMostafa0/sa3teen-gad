"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

import { cva, type VariantProps } from "class-variance-authority"

const TabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm",
  {
    variants: {
      variant: {
        default: "data-[state=active]:bg-background data-[state=active]:text-foreground",
        primary: "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        secondary: "data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground",
        destructive: "data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground",
        outline: "data-[state=active]:border data-[state=active]:border-input data-[state=active]:bg-background",
        ghost: "data-[state=active]:bg-accent data-[state=active]:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

// Create a context to pass the variant down
type TabsContextValue = {
  variant?: VariantProps<typeof TabsTriggerVariants>["variant"]
}

const TabsContext = React.createContext<TabsContextValue>({})

const useTabsContext = () => {
  const context = React.useContext(TabsContext)
  return context
}

// Tabs component with variant prop
interface TabsProps 
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
    VariantProps<typeof TabsTriggerVariants> {}

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ variant = "primary", ...props }, ref) => (
  <TabsContext.Provider value={{ variant }}>
    <TabsPrimitive.Root ref={ref} {...props} />
  </TabsContext.Provider>
))
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & 
  VariantProps<typeof TabsTriggerVariants>
>(({ className, variant: variantProp, ...props }, ref) => {
  const { variant: contextVariant } = useTabsContext()
  const variant = variantProp ?? contextVariant
  
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(TabsTriggerVariants({ variant, className }))}
      {...props}
    />
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }