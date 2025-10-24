import React, { useState, useEffect } from 'react';
import { Smile, Frown, Meh, TrendingUp, TrendingDown } from 'lucide-react';
import { aiService } from '../lib/aiService';
import { cn } from '../lib/utils';

const sentimentIcons = {
  positive: Smile,
  negative: Frown,
  neutral: Meh
};

const sentimentColors = {
  positive: 'text-green-500',
  negative: 'text-red-500',
  neutral: 'text-gray-500'
};

const sentimentBgColors = {
  positive: 'bg-green-50 border-green-200',
  negative: 'bg-red-50 border-red-200',
  neutral: 'bg-gray-50 border-gray-200'
};

export function SentimentIndicator({ message, className, showDetails = false }) {
  const [sentiment, setSentiment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (message && message.content) {
      analyzeSentiment();
    }
  }, [message]);

  const analyzeSentiment = async () => {
    if (!aiService.isAvailable()) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await aiService.analyzeSentiment(message.content);
      setSentiment(result);
    } catch (error) {
      console.warn('Sentiment analysis failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!sentiment || isLoading) {
    return null;
  }

  const IconComponent = sentimentIcons[sentiment.sentiment];
  const colorClass = sentimentColors[sentiment.sentiment];
  const bgColorClass = sentimentBgColors[sentiment.sentiment];

  if (!showDetails) {
    return (
      <div className={cn("inline-flex items-center", className)}>
        <IconComponent size={12} className={colorClass} />
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-center space-x-1 px-2 py-1 rounded border text-xs", bgColorClass, className)}>
      <IconComponent size={12} className={colorClass} />
      <span className="capitalize font-medium">{sentiment.sentiment}</span>
      {sentiment.confidence && (
        <span className="text-gray-500">
          ({Math.round(sentiment.confidence * 100)}%)
        </span>
      )}
    </div>
  );
}

export function ConversationSentimentTrend({ messages, className }) {
  const [trend, setTrend] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (messages && messages.length > 0) {
      analyzeTrend();
    }
  }, [messages]);

  const analyzeTrend = async () => {
    if (!aiService.isAvailable() || messages.length < 2) {
      return;
    }

    setIsLoading(true);
    try {
      // Analyze sentiment for recent messages
      const recentMessages = messages.slice(-5); // Last 5 messages
      const sentiments = await Promise.all(
        recentMessages.map(msg => aiService.analyzeSentiment(msg.content))
      );

      // Calculate trend
      const sentimentScores = sentiments.map(s => {
        switch (s.sentiment) {
          case 'positive': return 1;
          case 'negative': return -1;
          default: return 0;
        }
      });

      const avgScore = sentimentScores.reduce((sum, score) => sum + score, 0) / sentimentScores.length;
      const recentScore = sentimentScores.slice(-2).reduce((sum, score) => sum + score, 0) / 2;
      
      const trendDirection = recentScore > avgScore ? 'improving' : recentScore < avgScore ? 'declining' : 'stable';
      
      setTrend({
        direction: trendDirection,
        score: avgScore,
        confidence: sentiments.reduce((sum, s) => sum + s.confidence, 0) / sentiments.length
      });
    } catch (error) {
      console.warn('Sentiment trend analysis failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!trend || isLoading) {
    return null;
  }

  const TrendIcon = trend.direction === 'improving' ? TrendingUp : 
                   trend.direction === 'declining' ? TrendingDown : Meh;
  
  const trendColor = trend.direction === 'improving' ? 'text-green-500' :
                    trend.direction === 'declining' ? 'text-red-500' : 'text-gray-500';

  return (
    <div className={cn("flex items-center space-x-1 text-xs text-gray-600", className)}>
      <TrendIcon size={12} className={trendColor} />
      <span>Conversation tone is {trend.direction}</span>
    </div>
  );
}

