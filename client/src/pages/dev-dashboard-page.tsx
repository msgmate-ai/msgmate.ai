import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Activity, Users, MessageSquare, Zap, CreditCard, Eye, Brain, Lightbulb, Trash2 } from "lucide-react";

interface AnalyticsEvent {
  id: string;
  timestamp: string;
  type: 'signup' | 'email_verification' | 'message_generated' | 'tone_selection' | 'subscription_upgrade' | 'message_decoder' | 'message_coach' | 'conversation_starter';
  userId?: number;
  userEmail?: string;
  data?: any;
}

interface AnalyticsStats {
  total: number;
  byType: Record<string, number>;
  recentActivity: AnalyticsEvent[];
}

interface AnalyticsData {
  events: AnalyticsEvent[];
  stats: AnalyticsStats;
}

const eventIcons = {
  signup: Users,
  email_verification: Zap,
  message_generated: MessageSquare,
  tone_selection: Activity,
  subscription_upgrade: CreditCard,
  message_decoder: Eye,
  message_coach: Brain,
  conversation_starter: Lightbulb,
};

const eventColors = {
  signup: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  email_verification: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  message_generated: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  tone_selection: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  subscription_upgrade: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  message_decoder: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  message_coach: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  conversation_starter: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
};

export default function DevDashboardPage() {
  const { toast } = useToast();

  const { data, isLoading, error, refetch } = useQuery<AnalyticsData>({
    queryKey: ['/api/dev/analytics'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/dev/analytics');
      return res.json();
    },
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  const clearMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/dev/analytics/clear');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dev/analytics'] });
      toast({
        title: "Analytics cleared",
        description: "All analytics data has been cleared",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to clear analytics",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Access denied. This dashboard is only available to developers in development mode.
            Current user access: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const events = data?.events || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Developer Dashboard</h1>
          <p className="text-muted-foreground">Real-time MsgMate analytics (Development Only)</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 dark:bg-green-950">
            Live Data
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => clearMutation.mutate()}
            disabled={clearMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Data
          </Button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(stats.byType).map(([type, count]) => {
            const Icon = eventIcons[type as keyof typeof eventIcons];
            return (
              <Card key={type}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium capitalize">
                    {type.replace('_', ' ')}
                  </CardTitle>
                  {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{count}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
          <CardDescription>
            Latest {events.length} events • Total: {stats?.total || 0}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No events recorded yet. Start using the app to see analytics data.
              </p>
            ) : (
              events.map((event) => {
                const Icon = eventIcons[event.type];
                return (
                  <div key={event.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant="secondary" 
                          className={eventColors[event.type]}
                        >
                          {event.type.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(event.timestamp), 'PPp')}
                        </span>
                      </div>
                      <div className="text-sm">
                        {event.userEmail && (
                          <div className="font-medium">{event.userEmail}</div>
                        )}
                        {event.userId && (
                          <div className="text-muted-foreground">User ID: {event.userId}</div>
                        )}
                        {event.data && (
                          <div className="text-xs text-muted-foreground mt-2 bg-gray-50 dark:bg-gray-900 p-2 rounded">
                            {JSON.stringify(event.data, null, 2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}