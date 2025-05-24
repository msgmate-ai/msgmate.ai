import { createContext, ReactNode, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Subscription } from "@shared/schema";
import { getQueryFn, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

type SubscriptionContextType = {
  subscription: Subscription | null;
  isLoading: boolean;
  error: Error | null;
  refetchSubscription: () => void;
};

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  const {
    data: subscription,
    error,
    isLoading,
    refetch,
  } = useQuery<Subscription | undefined, Error>({
    queryKey: ["/api/subscription"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user,
  });

  const refetchSubscription = () => {
    refetch();
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription: subscription ?? null,
        isLoading,
        error,
        refetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    // If not wrapped in provider, create a minimal context
    const {
      data: subscription,
      error,
      isLoading,
      refetch,
    } = useQuery<Subscription | undefined, Error>({
      queryKey: ["/api/subscription"],
      queryFn: getQueryFn({ on401: "returnNull" }),
    });
    
    return {
      subscription: subscription ?? null,
      isLoading,
      error,
      refetchSubscription: refetch,
    };
  }
  return context;
}
