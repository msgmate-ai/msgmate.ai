#!/usr/bin/env node

// Analytics Report Generator for MsgMate
// Usage: node analytics-report.js

const fs = require('fs');
const path = require('path');

function generateAnalyticsReport() {
  const logsPath = path.join(process.cwd(), 'logs', 'analytics.jsonl');
  
  if (!fs.existsSync(logsPath)) {
    console.log('No analytics data found. File:', logsPath);
    return;
  }

  try {
    const rawData = fs.readFileSync(logsPath, 'utf-8');
    const lines = rawData.split('\n').filter(line => line.trim());
    const logs = lines.map(line => JSON.parse(line));

    // Initialize counters
    const eventCounts = {};
    const toneCounts = {};
    const signupEmails = new Set();
    const planCounts = {};
    const dailyStats = {};

    logs.forEach(log => {
      // Count events
      eventCounts[log.event] = (eventCounts[log.event] || 0) + 1;

      // Count tones
      if (log.tone) {
        toneCounts[log.tone] = (toneCounts[log.tone] || 0) + 1;
      }

      // Track signups
      if (log.event === 'User_Signed_Up' && log.email) {
        signupEmails.add(log.email);
      }

      // Track subscriptions
      if (log.event === 'User_Subscribed' && log.plan) {
        planCounts[log.plan] = (planCounts[log.plan] || 0) + 1;
      }

      // Daily activity
      const date = log.timestamp.split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = { events: 0, uniqueUsers: new Set() };
      }
      dailyStats[date].events++;
      if (log.email) {
        dailyStats[date].uniqueUsers.add(log.email);
      }
    });

    // Find most popular tone
    const mostPopularTone = Object.entries(toneCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    // Generate report
    console.log('\n=== MsgMate Analytics Report ===');
    console.log(`Generated: ${new Date().toLocaleString()}`);
    console.log(`Total Events: ${logs.length}`);
    console.log('');

    console.log('📊 Feature Usage:');
    console.log(`  Messages Generated: ${eventCounts['Message_Sent'] || 0}`);
    console.log(`  Conversation Starters: ${eventCounts['Conversation_Started'] || 0}`);
    console.log(`  Message Coach Used: ${eventCounts['Message_Coach_Used'] || 0}`);
    console.log(`  Messages Decoded: ${eventCounts['Message_Decoded'] || 0}`);
    console.log('');

    console.log('👥 User Activity:');
    console.log(`  Total Signups: ${signupEmails.size}`);
    console.log(`  Successful Logins: ${eventCounts['Login_Success'] || 0}`);
    console.log(`  Email Verifications: ${eventCounts['Email_Verified'] || 0}`);
    console.log('');

    console.log('💰 Subscriptions:');
    Object.entries(planCounts).forEach(([plan, count]) => {
      console.log(`  ${plan}: ${count}`);
    });
    console.log('');

    console.log('🎭 Popular Tones:');
    const sortedTones = Object.entries(toneCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    sortedTones.forEach(([tone, count]) => {
      console.log(`  ${tone}: ${count} uses`);
    });
    console.log('');

    console.log('📅 Daily Activity (Last 7 days):');
    const recentDates = Object.keys(dailyStats)
      .sort()
      .slice(-7);
    recentDates.forEach(date => {
      const stats = dailyStats[date];
      console.log(`  ${date}: ${stats.events} events, ${stats.uniqueUsers.size} users`);
    });
    console.log('');

    // Additional insights
    const totalMessages = eventCounts['Message_Sent'] || 0;
    const totalUsers = signupEmails.size;
    const avgMessagesPerUser = totalUsers > 0 ? (totalMessages / totalUsers).toFixed(1) : 0;

    console.log('📈 Insights:');
    console.log(`  Average messages per user: ${avgMessagesPerUser}`);
    console.log(`  Most popular tone: ${mostPopularTone}`);
    console.log(`  Conversion rate: ${totalUsers > 0 ? ((Object.values(planCounts).reduce((a, b) => a + b, 0) / totalUsers) * 100).toFixed(1) : 0}%`);
    console.log('================================\n');

  } catch (error) {
    console.error('Error reading analytics data:', error.message);
  }
}

// Run the report
generateAnalyticsReport();