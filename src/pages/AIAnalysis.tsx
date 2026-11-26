import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Brain, Target, Users, TrendingUp, Mail, Smartphone, Globe, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const API_BASE = 'http://localhost:5000/api';

export default function AIAnalysis() {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['marketing-recommendations'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/get-marketing-recommendations`);
      return response.json();
    }
  });

  const channelIcons = {
    'Email': Mail,
    'Social Media': Globe,
    'Mobile App': Smartphone,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">AI Analysis</h1>
        <p className="text-muted-foreground mt-1">Marketing recommendations and business insights powered by AI.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading AI recommendations...</div>
      ) : recommendations ? (
        <div className="grid gap-6">
          {/* Target Audience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Target Audience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{recommendations.target_audience}</p>
            </CardContent>
          </Card>

          {/* Recommended Channels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Recommended Marketing Channels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.target_channels.map((channel: string) => {
                  const Icon = channelIcons[channel as keyof typeof channelIcons] || Target;
                  return (
                    <div key={channel} className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                      <span className="font-medium">{channel}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Campaign Strategies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Campaign Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recommendations.campaign_strategies.map((strategy: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <span>{strategy}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Upload customer and sales data to get AI-powered marketing recommendations.</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
